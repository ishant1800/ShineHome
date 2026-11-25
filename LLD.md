# ShineHome — Low-Level Design (LLD)

## 1. Database Schemas (MongoDB / Mongoose)

### 1.1 `User` (`server/models/User.js`)
| Field | Type | Constraints / Default | Description |
|-------|------|-----------------------|-------------|
| `name` | `String` | Required, trimmed | User full name |
| `email` | `String` | Required, unique, lowercase | Login email address |
| `password` | `String` | Required, minlength 6 | Bcrypt-hashed password |
| `role` | `String` | Enum `['user', 'designer']`, default `'user'` | Account role |
| `favorites` | `[ObjectId]` | Ref `'Design'`, default `[]` | Saved design IDs |
| `createdAt` / `updatedAt` | `Date` | Mongoose `timestamps: true` | Audit timestamps |

### 1.2 `Design` (`server/models/Design.js`)
| Field | Type | Constraints / Default | Description |
|-------|------|-----------------------|-------------|
| `title` | `String` | Required, trimmed | Concept title (e.g., *Kyoto Warm Minimalist Sanctuary*) |
| `style` | `String` | Enum `['Japandi', 'Modern Minimalist', 'Mid-Century', 'Warm Industrial']` | Architectural style category |
| `description` | `String` | Required | Concept overview |
| `image` | `String` | Required | High-resolution room render URL |
| `designerName` | `String` | Required | Lead architect/designer name |
| `designerAvatar` | `String` | Default avatar URL | Designer portrait URL |
| `designerEmail` | `String` | Required | Direct email for designer outreach |
| `designerPhone` | `String` | Required | Direct phone for designer outreach |
| `rating` | `Number` | Default `4.8` | Average star rating (0–5) |
| `numReviews` | `Number` | Default `0` | Total review count |
| `featured` | `Boolean` | Default `false` | Hero featured flag |
| `hotspots` | `[HotspotSubdoc]` | `{ product: ObjectId(Product), x: Number, y: Number, label: String }` | Interactive room pin coordinates (0–100%) |
| `reviews` | `[ReviewSubdoc]` | `{ userName, rating, comment, createdAt }` | Embedded customer reviews |

### 1.3 `Product` (`server/models/Product.js`)
| Field | Type | Constraints / Default | Description |
|-------|------|-----------------------|-------------|
| `name` | `String` | Required, trimmed | Product name |
| `department` | `String` | Enum `['furniture', 'appliance']`, required | Storefront section |
| `category` | `String` | Required | Sub-category (e.g., `Seating`, `Tables`, `Chandeliers`, `Smart Lighting`) |
| `style` | `String` | Enum `['Japandi', 'Modern Minimalist', 'Mid-Century', 'Warm Industrial']` | Design style |
| `price` | `Number` | Required, min 0 | Unit price in USD |
| `description` | `String` | Required | Detailed copy |
| `image` | `String` | Required | Product photograph URL |
| `dimensions` | `String` | Optional | Physical dimensions (e.g., `88" W × 36" D × 30" H`) |
| `material` | `String` | Optional | Primary material / finish |
| `specs` | `Object` | `{ wattage, kelvin, lumens, smartSupport }` | Technical specifications for lighting & appliances |
| `rating` | `Number` | Default `4.8` | Average star rating |
| `numReviews` | `Number` | Default `0` | Review count |
| `inStock` | `Boolean` | Default `true` | Stock availability |
| `reviews` | `[ReviewSubdoc]` | `{ userName, rating, comment, createdAt }` | Embedded customer reviews |

### 1.4 `Order` (`server/models/Order.js`)
| Field | Type | Constraints / Default | Description |
|-------|------|-----------------------|-------------|
| `orderNumber` | `String` | Unique, auto-generated | Human-readable ID (e.g., `SH-2026-1042`) |
| `user` | `ObjectId` | Ref `'User'`, optional | Authenticated buyer reference |
| `items` | `[OrderItemSubdoc]` | `{ product: ObjectId(Product), name, image, price, quantity }` | Purchased line items |
| `shippingAddress` | `Object` | `{ fullName, email, phone, address, city, state, postalCode, country }` | Delivery details |
| `billingAddress` | `Object` | `{ fullName, address, city, state, postalCode, country }` | Billing details |
| `paymentMethod` | `String` | Enum `['UPI', 'Credit Card', 'Debit Card']`, required | Selected payment tab |
| `paymentDetails` | `Object` | `{ upiId, cardLast4, cardBrand }` | Sanitized payment reference |
| `subtotal` | `Number` | Required | Sum of `price * quantity` |
| `shippingCost` | `Number` | Required | `$0` if subtotal ≥ `$1,000`, else `$45` |
| `tax` | `Number` | Required | 8% estimated tax |
| `totalAmount` | `Number` | Required | Final charged total |
| `status` | `String` | Default `'Confirmed'` | Order fulfillment state |

---

## 2. REST API Endpoint Specification

| Method | Endpoint | Auth | Request Query / Body | Response (`200` / `201`) |
|--------|----------|------|----------------------|--------------------------|
| `GET` | `/api/health` | Public | — | `{ status: "ok", db: "connected" }` |
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` | `{ token, user: { _id, name, email, favorites } }` |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | `{ token, user: { _id, name, email, favorites } }` |
| `GET` | `/api/auth/me` | Bearer JWT | — | `{ user: { _id, name, email, favorites } }` |
| `GET` | `/api/designs` | Public | `?style=&search=` | `{ designs: [...] }` (with populated hotspot product summaries) |
| `GET` | `/api/designs/:id` | Public | — | `{ design: { ..., hotspots: [{ x, y, label, product }] } }` |
| `POST` | `/api/designs/:id/favorite` | Bearer JWT | — | `{ favorites: [...], isFavorited: boolean }` |
| `POST` | `/api/designs/:id/reviews` | Optional JWT | `{ userName, rating, comment }` | `{ design, review }` |
| `POST` | `/api/designs/:id/inquire` | Public | `{ name, email, phone, message }` | `{ success: true, message: "Inquiry sent to <designerName>" }` |
| `GET` | `/api/products` | Public | `?department=&category=&style=&minPrice=&maxPrice=&search=` | `{ products: [...], categories: [...] }` |
| `GET` | `/api/products/:id` | Public | — | `{ product }` |
| `POST` | `/api/products/:id/reviews` | Optional JWT | `{ userName, rating, comment }` | `{ product, review }` |
| `POST` | `/api/orders` | Optional JWT | `{ items, shippingAddress, billingAddress, paymentMethod, paymentDetails }` | `{ order: { orderNumber, totalAmount, status, ... } }` |
| `GET` | `/api/orders` | Bearer JWT | — | `{ orders: [...] }` |

---

## 3. React Frontend Component Hierarchy

```text
App (BrowserRouter, AuthProvider, CartProvider)
├── Navbar (Sticky glassmorphic bar, active links, Favorites drawer trigger, Cart badge, Auth state)
├── FavoritesDrawer (Slide-over moodboard showing saved designs with quick jump to /customize)
├── Main Route Outlet
│   ├── DesignGalleryPage (/)
│   │   ├── HeroShowcase (Headline, CTAs, Featured room preview card)
│   │   ├── FilterBar (Style pills + real-time search)
│   │   ├── DesignCard[] (Image, style tag, favorite toggle, designer, rating, action buttons)
│   │   ├── ContactDesignerModal (Phone, email, direct inquiry submission)
│   │   └── ReviewsModal (Star breakdown, review list, submit review form)
│   ├── CustomizationPage (/customize)
│   │   ├── RoomSelectorStrip (Switch between 6 architectural concepts)
│   │   ├── InteractiveRoomCanvas (Room image + pulsing hotspot pins)
│   │   └── ProductInspectorPanel (Active hotspot card, specs, View Full Details, Add to Cart)
│   ├── FurniturePage (/furniture)
│   │   ├── CatalogFilterSidebar (Search, category, style, price range)
│   │   └── ProductGrid -> ProductCard[] -> ProductDetailModal
│   ├── AppliancesPage (/appliances)
│   │   ├── CatalogFilterSidebar (Search, category, style, price range)
│   │   └── ProductGrid -> ProductCard[] (Technical spec badges: W, K, Smart) -> ProductDetailModal
│   ├── CartPage (/cart)
│   │   ├── CartItemRow[] (Thumbnail, unit price, quantity stepper -/+, remove button)
│   │   └── OrderSummaryCard (Subtotal, shipping, tax, total, Proceed to Checkout)
│   ├── CheckoutPage (/checkout)
│   │   ├── ShippingBillingForm
│   │   ├── PaymentMethodTabs (UPI | Credit Card | Debit Card)
│   │   └── OrderConfirmationReceipt
│   ├── AboutPage (/about)
│   │   └── BrandStory + 3-Step Workflow + Studio Highlights
│   └── LoginPage (/login)
│       └── SplitScreenAuth (Sign In / Create Account toggle)
└── Footer (Dark architectural #1E1E1E footer with explore links & studio concierge)
```
