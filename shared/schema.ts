import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const categories = ["حلويات", "موالح", "هدايا", "عطور"] as const;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  familyId: text("family_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category", { enum: categories }).notNull(),
  rating: numeric("rating", { precision: 3, scale: 1 }).default('0'),
  salesCount: integer("sales_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderStatuses = ["قيد المعالجة", "قيد التحضير", "خرج للتوصيل", "تم التسليم"] as const;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(), // Buyer
  familyId: text("family_id").references(() => users.id).notNull(), // Seller
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: orderStatuses }).default("قيد المعالجة"),
  deliveryAddress: text("delivery_address").notNull(),
  paymentMethod: text("payment_method").notNull(), // مدى, Apple Pay, الدفع عند الاستلام
  deliveryPersonName: text("delivery_person_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), 
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productsRelations = relations(products, ({ one }) => ({
  family: one(users, {
    fields: [products.familyId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "buyer"
  }),
  family: one(users, {
    fields: [orders.familyId],
    references: [users.id],
    relationName: "seller"
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, rating: true, salesCount: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true, deliveryPersonName: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true, isRead: true });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type ProductWithFamily = Product & { family: { firstName: string | null, lastName: string | null } };
export type OrderWithDetails = Order & { items: (OrderItem & { product: Product })[], user: { firstName: string | null, lastName: string | null } };
export * from "./models/auth";
