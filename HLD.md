# ShineHome — High-Level Design (HLD)

## 1. System Overview

ShineHome follows a decoupled **3-Tier MERN Architecture** separating the presentation layer (React Single-Page Application), application/business logic layer (Node.js + Express REST API), and persistence layer (MongoDB via Mongoose).

---

## 2. 3-Tier Architecture Diagram

```text
+-------------------------------------------------------------------------+
|                        CLIENT TIER (Browser / SPA)                      |
|   React 18 + Vite + React Router v6 + Tailwind CSS + Lucide Icons       |
|                                                                         |
|  +------------------+  +------------------+  +-----------------------+  |
|  |  Global Context  |  |   8 Route Pages  |  |  Shared Modals & UI   |  |
|  | - AuthContext    |  | /  /customize    |  | - Navbar & Footer     |  |
|  | - CartContext    |  | /furniture       |  | - ContactDesignerModal|  |
|  | - FavoritesState |  | /appliances      |  | - ReviewsModal        |  |
|  +--------+---------+  | /cart /checkout  |  | - ProductDetailModal  |  |
|           |            | /about /login    |  +-----------+-----------+  |
|           +------------+--------+---------+              |              |
|                                 | Axios / Fetch JSON + Bearer JWT       |
+---------------------------------+---------------------------------------+
                                  | HTTPS / HTTP (:5000/api/*)
                                  v
+-------------------------------------------------------------------------+
|                    APPLICATION TIER (Node.js + Express)                 |
|                                                                         |
|  +--------------------+   +------------------------------------------+  |
|  |  Middleware Layer  |   |             REST API Routers             |  |
|  | - CORS & JSON      |   | - /api/auth     (Register, Login, Me)    |  |
|  | - authMiddleware   |   | - /api/designs  (List, Detail, Fav, Rev) |  |
|  | - optionalAuth     |   | - /api/products (Filter, Detail, Review) |  |
|  | - errorHandler     |   | - /api/orders   (Create & List Orders)   |  |
|  +--------------------+   +--------------------+---------------------+  |
|                                                | Mongoose ODM           |
+------------------------------------------------+------------------------+
                                                 | Wire Protocol (:27017)
                                                 v
+-------------------------------------------------------------------------+
|                        DATA TIER (MongoDB Database)                     |
|                                                                         |
|  +-----------+   +-----------+   +-----------+   +-------------------+  |
|  |   users   |   |  designs  |   | products  |   |      orders       |  |
|  +-----------+   +-----------+   +-----------+   +-------------------+  |
+-------------------------------------------------------------------------+
```

---

## 3. Core Architectural Modules

### 3.1 Presentation Tier (`/client`)
- **Design System & Theming:** Tailwind CSS configured with ShineHome custom design tokens (`cream: #FAF8F5`, `sand: #EFECE6`, `charcoal: #1E1E1E`, `terracotta: #C86D51`, `brass: #B8860B`) and Google Fonts (`Playfair Display`, `Plus Jakarta Sans`).
- **State Management:**
  - `AuthContext`: Persists JWT token and authenticated user profile (`id`, `name`, `email`, `favorites`), exposing `login`, `register`, `logout`, and `toggleFavorite`.
  - `CartContext`: Manages shopping cart items, quantity updates, item removal, subtotal/shipping/tax/total computation, and `localStorage` persistence.
- **API Client (`src/services/api.js`):** Centralized HTTP wrapper injecting `Authorization: Bearer <token>` headers automatically when authenticated.

### 3.2 Application Tier (`/server`)
- **Authentication & Security:** `bcryptjs` hashes user passwords with salt rounds before storage; `jsonwebtoken` issues signed 7-day JWTs verified by `protect` and `optionalProtect` Express middleware.
- **Catalog & Gallery Engine:** Server-side query filtering for designs (by `style` and text search across `title`, `designerName`, `description`) and products (by `department`, `category`, `style`, `minPrice`, `maxPrice`, `search`).
- **Hotspot Cross-Linking:** `Design` documents embed `hotspots` referencing `Product` ObjectIds alongside normalized `(x, y)` percentage coordinates, populated on demand for `/customize`.
- **Order Processing:** Validates cart line items, computes server-verified totals (subtotal, shipping, 8% tax), persists shipping/billing metadata and masked payment method info (`UPI`, `Credit Card`, `Debit Card`), and returns an order confirmation receipt.

### 3.3 Persistence Tier (MongoDB)
- Four normalized/semi-embedded collections: `users`, `designs`, `products`, and `orders`.
- Idempotent seed module (`server/seed.js` + `server/utils/seedData.js`) populates 6 curated interior designs with interactive hotspot coordinates, 8 furniture pieces, 6 appliances/lighting fixtures with technical specs, and initial customer reviews.
- Automatic local fallback to `mongodb-memory-server` when `MONGO_URI` is unreachable in offline development environments.

---

## 4. Key Data Flows

### 4.1 Authentication & Favorites Flow
1. User submits credentials on `/login` -> `POST /api/auth/login` or `POST /api/auth/register`.
2. Backend verifies credentials (`bcryptjs.compare`), signs a JWT, and returns `{ token, user }`.
3. Client stores `{ token, user }` in `AuthContext` + `localStorage`.
4. Clicking the heart icon on a Design card triggers `POST /api/designs/:id/favorite` (or updates local favorites if browsing as guest), immediately updating the navbar Favorites counter.

### 4.2 Interactive Room Customization -> Cart -> Checkout Flow
1. User opens `/customize` (optionally via `/customize?design=<id>`).
2. Client fetches `GET /api/designs/:id`, receiving room photo and populated `hotspots[].product`.
3. Clicking a pulsing hotspot pin updates the live Product Inspector sidebar.
4. Clicking **Add to Cart** pushes the item into `CartContext`, updating the navbar Cart badge.
5. On `/cart`, user adjusts quantities and proceeds to `/checkout`.
6. Submitting `/checkout` posts to `POST /api/orders`, persists the `Order` document, clears the cart, and renders the confirmation receipt.
