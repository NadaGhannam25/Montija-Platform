import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas, auth } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth/routes";
import { loginUser, registerUser } from "./replit_integrations/auth/local-auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // Local auth endpoints
  app.post(auth.register.path, async (req, res) => {
    try {
      const input = auth.register.input.parse(req.body);
      const user = await registerUser(input.email, input.password, input.firstName, input.lastName, input.userType);
      
      // Set session
      req.login({ id: user.id, email: user.email, userType: user.userType, firstName: user.firstName, lastName: user.lastName }, (err) => {
        if (err) return res.status(500).json({ message: "خطأ في الجلسة" });
        res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType });
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "خطأ في التسجيل" });
    }
  });

  app.post(auth.login.path, async (req, res) => {
    try {
      const input = auth.login.input.parse(req.body);
      const user = await loginUser(input.email, input.password);
      
      // Set session
      req.login({ id: user.id, email: user.email, userType: user.userType, firstName: user.firstName, lastName: user.lastName }, (err) => {
        if (err) return res.status(500).json({ message: "خطأ في الجلسة" });
        res.status(200).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType });
      });
    } catch (err: any) {
      res.status(401).json({ message: err.message || "فشل تسجيل الدخول" });
    }
  });

  app.get(auth.me.path, (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.json(null);
    }
    const user = req.user as any;
    res.json({ id: user.id || user.claims?.sub, email: user.email || user.claims?.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType });
  });

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

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  // Reviews
  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const reviews = await storage.getReviews(Number(req.params.id));
      res.json(reviews);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.post('/api/products/:id/reviews', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const userId = user.claims?.sub || user.id;
    try {
      const { rating, comment } = req.body;
      const review = await storage.createReview({
        productId: Number(req.params.id),
        userId,
        rating: Number(rating),
        comment,
      });
      res.status(201).json(review);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const userId = user.claims?.sub || user.id;
    try {
      const buyerOrders = await storage.getOrders(userId, 'customer');
      const sellerOrders = await storage.getOrders(userId, 'family');
      
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
    const userId = user.claims?.sub || user.id;
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder({
        userId,
        familyId: input.familyId,
        totalAmount: input.totalAmount,
        deliveryAddress: input.deliveryAddress,
        paymentMethod: input.paymentMethod,
      }, input.items);
      
      // Try to fetch detailed order back for response
      const orders = await storage.getOrders(userId, 'customer');
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
      
      res.json({ success: true });
    } catch(err) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.stats.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const userId = user.claims?.sub || user.id;
    try {
      const sellerOrders = await storage.getOrders(userId, 'family');
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
