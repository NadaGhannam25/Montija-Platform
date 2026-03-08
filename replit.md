# Montija (منتجة) - E-Commerce Platform

## Overview

Montija is an Arabic-language e-commerce marketplace designed to support local family businesses ("productive families") by allowing them to list and sell their products online. The platform covers the full order lifecycle: product browsing → cart → checkout → order tracking. It also includes a seller dashboard for families to manage products and view sales analytics.

Key features:
- **Product catalog** with category filtering and search (sweets, savories, gifts, perfumes, baked goods, handmade items)
- **Shopping cart** with persistent state via Zustand
- **Checkout flow** with address input and multiple payment method options (Mada, Apple Pay, cash on delivery)
- **Order tracking** with status progression (processing → preparing → out for delivery → delivered)
- **Family seller dashboard** with product CRUD and sales analytics charts
- **Notifications system** with unread badge counter
- **FAQ page** with accordion UI and a rule-based chatbot
- **Bilingual AR/EN toggle** — full RTL Arabic / LTR English switching with `LanguageContext`, stored in `localStorage` key `muntija-lang`; translations in `client/src/i18n/translations.ts`
- **About Us page** (`/about`) — Platform story (SDAIA Prompt Engineering Bootcamp), developer profiles for Nada Almutairi & Latifah Alomair
- **Footer** — Brand, quick links, categories, "Made with love for you" + copyright
- **Profile dropdown** — avatar button opens menu with Profile, My Orders, and Logout (each with icon + subtitle)
- **RTL layout** default (Arabic UI, `dir="rtl"`); LTR in English mode
- **Customer reviews** system with per-product ratings and comments; seeded reviews; write-review form for logged-in users
- **Customer testimonials** section on home page (static, bilingual)
- **Local auth** (email/password, scrypt hashing) with user types: `customer` | `family`; separate Login and Register pages
- **Categories dropdown** in navbar that filters products by category

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Monorepo Layout

```
/
├── client/         # React SPA (Vite)
├── server/         # Express.js API
├── shared/         # Shared types, schemas, route contracts
├── script/         # Build utilities
└── seed.ts         # Database seeding script
```

Code is shared between client and server via the `shared/` directory, accessible with the `@shared/*` alias.

### Frontend (React + Vite)

- **Framework**: React 18 with TypeScript, built with Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State management**:
  - **Zustand** with `persist` middleware for the shopping cart (survives page refresh)
  - **TanStack Query (React Query v5)** for all server state (products, orders, notifications)
- **UI components**: shadcn/ui (Radix UI primitives + Tailwind CSS), "new-york" style
- **Animations**: Framer Motion for page transitions and chatbot toggle
- **Charts**: Recharts for seller dashboard analytics
- **Forms**: React Hook Form + Zod resolvers
- **Fonts**: Tajawal (Arabic-optimized Google Font)
- **i18n / Bilingual**: `LanguageContext` + `useLanguage()` hook from `client/src/contexts/LanguageContext.tsx`; translation strings in `client/src/i18n/translations.ts`; language toggle button in Header; all pages use `t.*` for display text; direction auto-applied via `document.documentElement.dir`
- **RTL/LTR**: Dynamically toggled by `LanguageContext`; Tailwind logical properties used (`start`, `end`, `ps`, `pe`, etc.)

**Pages:**
| Route | Component | Purpose |
|---|---|---|
| `/` | Home | Product grid, category filter, search, customer testimonials |
| `/login` | Login | Email/password login |
| `/register` | Register | Account creation (customer or family type) |
| `/product/:id` | ProductDetails | Full detail view, live reviews, add to cart |
| `/checkout` | Checkout | Address, payment method selection, order confirmation |
| `/orders` | MyOrders | Order history with status tracker |
| `/dashboard` | Dashboard | Seller product management + analytics |
| `/faq` | FAQ | Accordion FAQ + chatbot |

### Backend (Express.js)

- **Framework**: Express with TypeScript, run via `tsx`
- **Dev server**: Vite is integrated into the Express server in development mode (`server/vite.ts`), serving the SPA with HMR
- **Production build**: esbuild bundles the server to `dist/index.cjs`; Vite builds the client to `dist/public`
- **API routes**: Defined in `server/routes.ts`, following the route contracts declared in `shared/routes.ts`
- **Storage layer**: `server/storage.ts` — a `DatabaseStorage` class wraps all DB operations using Drizzle ORM
- **Session**: `express-session` with PostgreSQL session store (`connect-pg-simple`), using the `sessions` table

### Authentication

Two auth modes coexist:

1. **Local auth** (primary): Email + password, hashed with `scrypt` + random salt. Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`. Frontend uses `useAuthLocal` hook.
2. **Replit OpenID Connect auth** (legacy/secondary): OAuth via `openid-client` + Passport.js, for Replit-hosted deployments. Frontend uses `useAuth` hook.

Sessions are stored in the `sessions` PostgreSQL table and attached via Passport.js `req.login`.

User types:
- `customer` — can browse, buy, review
- `family` — can also manage products via the dashboard

### Data Layer

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (connection string via `DATABASE_URL` env var)
- **Schema** (`shared/schema.ts` + `shared/models/auth.ts`):

| Table | Purpose |
|---|---|
| `users` | All users (customers + families); UUID primary key |
| `sessions` | Express session storage |
| `products` | Product listings; linked to `users` (family) |
| `orders` | Orders placed by customers; linked to buyer + seller |
| `order_items` | Line items per order |
| `notifications` | Per-user notifications |
| `reviews` | Product reviews with rating + comment |

- **Migrations**: `drizzle-kit` with `db:push` for schema sync
- **Seeding**: `seed.ts` populates demo users, products, and reviews

### Shared Route Contracts

`shared/routes.ts` defines typed API endpoint specs (method, path, input schema, response schemas) using Zod. Both client hooks and server handlers reference these specs, ensuring type consistency without a full RPC framework.

### Styling

- Tailwind CSS with CSS custom properties (HSL color variables) for theming
- Custom warm amber primary color (`#F59E0B` range)
- Dark mode support via `.dark` class
- Custom CSS classes: `glass`, `card-hover`, `text-gradient`, `hover-elevate`, `active-elevate-2`
- Base radius: `1rem` (rounded corners throughout)

---

## External Dependencies

### Runtime Services
| Service | Purpose |
|---|---|
| **PostgreSQL** | Primary database (requires `DATABASE_URL` env var) |
| **Replit OIDC** (`https://replit.com/oidc`) | Optional OpenID Connect auth provider for Replit deployments (requires `REPL_ID`, `ISSUER_URL`, `SESSION_SECRET`) |

### Key NPM Dependencies
| Package | Role |
|---|---|
| `drizzle-orm` + `pg` | PostgreSQL ORM and driver |
| `drizzle-zod` | Auto-generate Zod schemas from Drizzle tables |
| `express` + `express-session` | HTTP server and session management |
| `connect-pg-simple` | PostgreSQL session store for Express |
| `passport` + `passport-local` + `openid-client` | Authentication strategies |
| `zustand` | Client-side cart state management |
| `@tanstack/react-query` | Server state and data fetching |
| `wouter` | Lightweight React router |
| `framer-motion` | Animations and transitions |
| `recharts` | Charts in seller dashboard |
| `react-hook-form` + `@hookform/resolvers` | Form state and validation |
| `zod` | Schema validation (shared client/server) |
| `shadcn/ui` (Radix UI) | Accessible UI component primitives |
| `date-fns` | Date formatting (Arabic locale `arSA`) |
| `nanoid` | ID generation |

### Environment Variables Required
```
DATABASE_URL       # PostgreSQL connection string
SESSION_SECRET     # Express session signing secret
REPL_ID            # (Optional) For Replit OIDC auth
ISSUER_URL         # (Optional) OIDC issuer, defaults to https://replit.com/oidc
```