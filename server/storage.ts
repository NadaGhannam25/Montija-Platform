import { db } from "./db";
import { products, orders, orderItems, notifications, reviews, type InsertProduct, type InsertOrder, type InsertReview, type ProductWithFamily, type OrderWithDetails } from "@shared/schema";
import { users } from "@shared/models/auth";
import { eq, desc, and } from "drizzle-orm";

export class DatabaseStorage {
  async getProducts(category?: string, search?: string) {
    let query = db.select({
      product: products,
      family: {
        firstName: users.firstName,
        lastName: users.lastName
      }
    }).from(products)
      .innerJoin(users, eq(products.familyId, users.id));

    const results = await query.orderBy(desc(products.createdAt));
    
    let filtered = results;
    if (category) {
      filtered = filtered.filter(r => r.product.category === category);
    }
    if (search) {
      filtered = filtered.filter(r => r.product.name.includes(search) || r.product.description.includes(search));
    }
    
    return filtered.map(r => ({ ...r.product, family: r.family }));
  }

  async getProduct(id: number) {
    const results = await db.select({
      product: products,
      family: {
        firstName: users.firstName,
        lastName: users.lastName
      }
    }).from(products)
      .innerJoin(users, eq(products.familyId, users.id))
      .where(eq(products.id, id));
    
    if (!results.length) return undefined;
    return { ...results[0].product, family: results[0].family };
  }

  async createProduct(data: InsertProduct) {
    const [product] = await db.insert(products).values(data).returning();
    const [user] = await db.select().from(users).where(eq(users.id, product.familyId));
    return { ...product, family: { firstName: user.firstName, lastName: user.lastName } };
  }

  async getOrders(userId: string, role: 'customer' | 'family') {
    const orderResults = await db.select().from(orders)
      .where(role === 'family' ? eq(orders.familyId, userId) : eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
      
    const detailedOrders = await Promise.all(orderResults.map(async (o) => {
      const items = await db.select({
        orderItem: orderItems,
        product: products
      }).from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, o.id));
        
      const [user] = await db.select().from(users).where(eq(users.id, o.userId));
      
      return {
        ...o,
        items: items.map(i => ({ ...i.orderItem, product: i.product })),
        user: { firstName: user?.firstName || null, lastName: user?.lastName || null }
      };
    }));
    
    return detailedOrders;
  }

  async createOrder(data: InsertOrder, items: { productId: number, quantity: number, price: string }[]) {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values(data).returning();
      
      for (const item of items) {
        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
        
        const [prod] = await tx.select().from(products).where(eq(products.id, item.productId));
        if (prod) {
          await tx.update(products).set({ salesCount: (prod.salesCount || 0) + item.quantity }).where(eq(products.id, item.productId));
        }
      }
      return order;
    });
  }

  async getOrder(id: number) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;
    const items = await db.select({
      orderItem: orderItems,
      product: products
    }).from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));
    const [user] = await db.select().from(users).where(eq(users.id, order.userId));
    return {
      ...order,
      items: items.map(i => ({ ...i.orderItem, product: i.product })),
      user: { firstName: user?.firstName || null, lastName: user?.lastName || null }
    };
  }

  async updateOrderStatus(id: number, status: string) {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getReviews(productId: number) {
    const results = await db.select({
      review: reviews,
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
      }
    }).from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
    return results.map(r => ({ ...r.review, user: r.user }));
  }

  async createReview(data: InsertReview) {
    const [review] = await db.insert(reviews).values(data).returning();
    const [user] = await db.select({ firstName: users.firstName, lastName: users.lastName }).from(users).where(eq(users.id, data.userId));
    return { ...review, user };
  }

  async getNotifications(userId: string) {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }
}

export const storage = new DatabaseStorage();
