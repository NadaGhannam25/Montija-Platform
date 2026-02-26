import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.products.list.path, async (req, res) => {
    try {
      const { category, search } = req.query;
      const products = await storage.getProducts(category as string, search as string);
      res.json(products);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) return res.status(404).json({ message: "Not found" });
      res.json(product);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.products.create.input.parse({ ...req.body, familyId: user.claims.sub });
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal error" });
      }
    }
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    try {
      const buyerOrders = await storage.getOrders(user.claims.sub, 'customer');
      const sellerOrders = await storage.getOrders(user.claims.sub, 'family');
      
      // Combine unique
      const all = [...buyerOrders, ...sellerOrders];
      const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
      
      res.json(unique);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder({
        userId: user.claims.sub,
        familyId: input.familyId,
        totalAmount: input.totalAmount,
        deliveryAddress: input.deliveryAddress,
        paymentMethod: input.paymentMethod,
      }, input.items);
      
      // Try to fetch detailed order back for response
      const orders = await storage.getOrders(user.claims.sub, 'customer');
      const detailedOrder = orders.find(o => o.id === order.id);
      
      res.status(201).json(detailedOrder || order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal error" });
      }
    }
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.orders.updateStatus.input.parse(req.body);
      await storage.updateOrderStatus(Number(req.params.id), input.status);
      
      // We should really return the detailed order, but returning success is ok
      res.json({ success: true });
    } catch(err) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.stats.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    try {
      const sellerOrders = await storage.getOrders(user.claims.sub, 'family');
      const totalSales = sellerOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      const orderCount = sellerOrders.length;
      
      res.json({
        totalSales,
        orderCount,
        topProducts: [] // Simplified for now
      });
    } catch(e) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  return httpServer;
}
