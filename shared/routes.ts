import { z } from 'zod';
import { insertProductSchema, products, orders, orderItems, notifications } from './schema';
import type { ProductWithFamily, OrderWithDetails } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() })
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      input: z.object({ category: z.string().optional(), search: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<ProductWithFamily>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id' as const,
      responses: {
        200: z.custom<ProductWithFamily>(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/products' as const,
      input: insertProductSchema,
      responses: {
        201: z.custom<ProductWithFamily>(),
        401: errorSchemas.unauthorized,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/products/:id' as const,
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom<ProductWithFamily>(),
        404: errorSchemas.notFound,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/products/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  orders: {
    list: {
      method: 'GET' as const,
      path: '/api/orders' as const,
      responses: {
        200: z.array(z.custom<OrderWithDetails>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: z.object({
        familyId: z.string(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          price: z.string()
        })),
        deliveryAddress: z.string(),
        paymentMethod: z.string(),
        totalAmount: z.string()
      }),
      responses: {
        201: z.custom<OrderWithDetails>(),
        401: errorSchemas.unauthorized,
      }
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<OrderWithDetails>(),
        404: errorSchemas.notFound,
      }
    }
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications' as const,
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
      }
    },
    markRead: {
      method: 'PATCH' as const,
      path: '/api/notifications/:id/read' as const,
      responses: {
        200: z.custom<typeof notifications.$inferSelect>(),
      }
    }
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          totalSales: z.number(),
          orderCount: z.number(),
          topProducts: z.array(z.any())
        })
      }
    }
  }
};

export const auth = {
  register: {
    method: 'POST' as const,
    path: '/api/auth/register' as const,
    input: z.object({
      email: z.string().email(),
      password: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      userType: z.enum(["customer", "family"]),
    }),
    responses: {
      201: z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        userType: z.string(),
      }),
      400: errorSchemas.validation,
    }
  },
  login: {
    method: 'POST' as const,
    path: '/api/auth/login' as const,
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        userType: z.string(),
      }),
      401: errorSchemas.unauthorized,
    }
  },
  me: {
    method: 'GET' as const,
    path: '/api/auth/me' as const,
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        userType: z.string(),
      }).nullable(),
      401: errorSchemas.unauthorized,
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
