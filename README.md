# Zyro — Frontend

## Project overview

Zyro is an **escrow-based peer-to-peer marketplace** built with React and Vite. Buyers and sellers transact safely: funds are held in escrow after a purchase and released to the seller only after the buyer confirms delivery.

This document covers everything in the frontend — pages, components, hooks, API layer, routes, and how to run it.

---

## Features

- Marketplace browsing, search, filtering, and product details
- Mock authentication with seeded products, orders, chats, and wallet data
- Buyer and seller order flows with escrow status
- Chat, wallet, profile, notifications, KYC, and listing flows
- Switchable mock and HTTP API implementations

## Installation

```bash
npm install
```

## Running

```bash
npm run dev
```

The default development server runs at `http://localhost:5173`. It uses mock mode, so no backend is required.

## Environment variables

Copy `.env.example` to `.env` when configuration is needed. `.env` is ignored and must not be committed.

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Zyro
VITE_ENABLE_GOOGLE_LOGIN=false
```

`VITE_API_BASE_URL` is only used in live mode. `VITE_USE_MOCK=true` is the recommended default for frontend development.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Mock Mode](#mock-mode)
4. [Live Mode](#live-mode)
5. [Available routes](#available-routes)
6. [Pages](#pages)
7. [React Hooks Used](#react-hooks-used)
8. [Custom Hooks](#custom-hooks)
9. [Components](#components)
10. [API Layer](#api-layer)
11. [Auth Context](#auth-context)
12. [Design System](#design-system)
13. [Animations & CSS](#animations--css)
14. [Development Workflow](#development-workflow)
15. [Contribution Notes](#contribution-notes)
16. [Backend Integration Notes](#backend-integration-notes)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI library (functional components only) |
| Vite | Build tool and dev server |
| Tailwind CSS v3 | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client (real API mode) |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |

---

## Project Structure

```
frontend/
├── public/
│   └── favicon.png             # Browser icon
│
├── src/
│   ├── api/
│   │   ├── config.js            # USE_MOCK flag, base URL
│   │   ├── client.js            # Axios instance with auth interceptors
│   │   ├── index.js             # Exports mock or real API based on flag
│   │   ├── mock/                # In-memory mock implementations
│   │   │   ├── mockDb.js        # Shared in-memory state
│   │   │   ├── auth.mock.js
│   │   │   ├── product.mock.js
│   │   │   ├── order.mock.js
│   │   │   ├── chat.mock.js
│   │   │   ├── wallet.mock.js
│   │   │   ├── users.js         # Seed user data
│   │   │   ├── products.js      # Seed product data + getProductById
│   │   │   ├── orders.js        # Seed order data
│   │   │   ├── chats.js         # Seed chat data
│   │   │   ├── wallet.js        # Seed wallet/transaction data
│   │   │   └── index.js         # Re-exports all mock data
│   │   └── real/                # Real HTTP API calls (Spring Boot backend)
│   │       ├── auth.api.js
│   │       ├── product.api.js
│   │       ├── order.api.js
│   │       ├── chat.api.js
│   │       └── wallet.api.js
│   │
│   ├── components/
│   │   ├── common/              # Shared UI components
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ErrorCard.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── StatusTimeline.jsx
│   │   │   └── index.js         # Barrel export
│   │   └── product/
│   │       └── ProductCard.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state, session management
│   │
│   ├── hooks/
│   │   ├── useChat.js
│   │   ├── useDebounce.js
│   │   ├── useFetch.js
│   │   ├── useForm.js
│   │   ├── useLocalStorage.js
│   │   ├── useOrders.js
│   │   ├── useProducts.js
│   │   └── useWallet.js
│   │
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── ComingSoonPage.jsx
│   │   ├── CreateListingPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── KYCPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductListPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── WalletPage.jsx
│   │
│   ├── routes/
│   │   ├── ProtectedRoute.jsx   # Redirects unauthenticated users to /auth
│   │   └── PublicRoute.jsx      # Redirects authenticated users to /home
│   │
│   ├── utils/
│   │   └── format.js            # formatDate, formatCurrency, initials, etc.
│   │
│   ├── index.css                # Tailwind directives + custom animations
│   └── main.jsx                 # App entry point, routing tree, ErrorBoundary
│
├── .env.example                # Documented local configuration
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Folder explanations

- `src/pages/` contains route-level screens and page-specific UI.
- `src/components/` contains reusable visual building blocks.
- `src/hooks/` contains stateful and data-fetching hooks.
- `src/context/` contains application-wide state providers.
- `src/api/mock/` contains offline implementations and seed data.
- `src/api/real/` contains live backend request implementations.
- `src/routes/` contains route guards.
- `src/utils/` contains shared formatting and helper functions.

## Mock Mode

The entire API layer has two implementations — mock and real — that share the same function signatures.

`src/api/config.js` reads `VITE_USE_MOCK` and exports a `USE_MOCK` boolean.
`src/api/index.js` conditionally exports the correct implementation:

```js
export const authAPI    = USE_MOCK ? mockAuthAPI    : realAuthAPI;
export const productsAPI= USE_MOCK ? mockProductsAPI: realProductsAPI;
export const ordersAPI  = USE_MOCK ? mockOrdersAPI  : realOrdersAPI;
export const chatAPI    = USE_MOCK ? mockChatAPI    : realChatAPI;
export const walletAPI  = USE_MOCK ? mockWalletAPI  : realWalletAPI;
```

**Mock mode** (`VITE_USE_MOCK=true`):
- All data lives in-memory (`mockDb.js`), seeded with realistic products, orders, transactions, and chat history
- No network requests — login, browsing, ordering, chat, and wallet all work offline
- Switching to live mode only requires setting `VITE_USE_MOCK=false` and starting the Spring Boot backend

Mock mode makes no network requests and should work after only `npm install` and `npm run dev`.

## Live Mode

Set `VITE_USE_MOCK=false`, configure `VITE_API_BASE_URL`, and start the backend services described in [Backend Integration Notes](#backend-integration-notes). The real API modules retain the same function signatures as the mock modules.

---

## Available routes

All routes except `/auth` are wrapped in `ProtectedRoute` (requires login).

| Path | Page | Notes |
|------|------|-------|
| `/` | → redirects to `/home` | |
| `/auth` | `AuthPage` | Public only — redirects to `/home` if already logged in |
| `/home` | `HomePage` | Marketplace landing |
| `/products` | `ProductListPage` | Search, filter, sort all listings |
| `/products/:id` | `ProductDetailPage` | Single product with buy flow |
| `/create-listing` | `CreateListingPage` | 3-step listing wizard |
| `/orders` | `OrdersPage` | Buying + Selling tabs |
| `/orders/:id` | `OrderDetailPage` | Escrow timeline, confirm/dispute |
| `/chats` | `ChatPage` | Chat list + active conversation |
| `/chats/:chatId` | `ChatPage` | Deep-link to specific chat |
| `/profile` | `ProfilePage` | Profile, Wallet, Listings, KYC tabs |
| `/wallet` | `WalletPage` | Full wallet dashboard |
| `/notifications` | `NotificationsPage` | |
| `/kyc` | `KYCPage` | |
| `/settings` | `SettingsPage` | |
| `*` | `NotFoundPage` | 404 catch-all |

### Route Guards

**`ProtectedRoute`** — checks `isAuthenticated` from `AuthContext`. Shows a spinner while the session is being hydrated from localStorage. Redirects to `/auth` (with `location.state.from` preserved) if not logged in.

**`PublicRoute`** — for `/auth` only. Redirects to `/home` if the user is already authenticated.

---

## Pages

### AuthPage (`/auth`)
Multi-step OTP login. Tab 1: mobile number + country code selector → Send OTP → 6-box OTP input with auto-submit when all 6 digits are filled, paste support, keyboard navigation, and a 30-second resend countdown. Tab 2: Google auth placeholder. Uses `useReducer`-style multi-step flow, `useRef` for OTP input focus management, `useMemo` for the formatted mobile string.

### HomePage (`/home`)
Hero section with an animated escrow flow card (3 steps cycle every 2 seconds via `setInterval` in `useEffect`). Marketplace section below with category filter pills and a product grid. Uses `useMemo` to filter products by category, `useCallback` for event handlers.

### ProductListPage (`/products`)
Full marketplace browse. Reads `?q=`, `?state=`, and `?category=` from the URL via `useSearchParams` (populated by the Navbar search and location selector). Live mode sends those values to `/products` as `search`, `state`, and `category` params; the page still applies lightweight local filtering/sorting to the returned list.

### ProductDetailPage (`/products/:id`)
Product images with a thumbnail strip. Clicking any image opens a full-screen lightbox (`useState` for open/index, `useEffect` for Escape/ArrowLeft/ArrowRight keyboard handlers). Purchase flow uses `useReducer` with states: `idle → confirming → processing → success/error`. Seller card sits below the images on the left column.

### CreateListingPage (`/create-listing`)
3-step wizard. Step 1: title, price, condition, category, state (dropdown of 33 Indian states/UTs), city (dropdown that populates per state via `useEffect`). Step 2: image URL and description textarea. Step 3: review and publish. Each step validates before advancing.

### ChatPage (`/chats/:chatId`)
Chat list on the left, messages on the right. Uses the `useChat` custom hook, which loads messages when a chat opens and refreshes the local message list after sending. `useRef` on the message input auto-refocuses after send. `useRef` on the bottom div handles auto-scroll. A product preview banner shows the item being discussed with a "View Item" link. Escrow request button opens a modal where the buyer can propose an escrow amount; that message renders with a special indigo bubble.

### OrdersPage (`/orders`)
Two tabs: Buying and Selling. Uses the `useOrders` custom hook. Shows wallet transaction history below orders.

### OrderDetailPage (`/orders/:id`)
Escrow status card with a visual `StatusTimeline`. Buyer can confirm delivery or raise a dispute. `useMemo` is used to derive timeline steps from the order status.

### WalletPage (`/wallet`)
Green gradient balance card with a count-up animation on load (`setInterval` in `useEffect`, cleared on unmount). Month selector filters transactions. Top-up modal with quick-select chips or custom amount. Withdraw opens a "Coming Soon" modal.

### ProfilePage (`/profile`)
Sidebar-tabbed dashboard: Profile (editable name/email with inline validation, read-only mobile), Wallet (balance card + recent transactions), My Listings, Orders (redirects), KYC (coming soon card), Settings (coming soon card).

### ProductListPage, NotFoundPage, KYCPage, SettingsPage, NotificationsPage
Standard pages — NotFoundPage has a back-to-home action; the others are either functional or show a coming-soon state.

---

## React Hooks Used

Every built-in React hook is used somewhere in the project:

| Hook | Where used |
|------|-----------|
| `useState` | All pages and many components — local UI state (loading, error, form fields, modal open/close, selected values) |
| `useEffect` | Data loading on mount, keyboard event listeners (lightbox), countdown timer (OTP resend), city reset on state change |
| `useReducer` | `ProductDetailPage` — purchase flow state machine (`idle → confirming → processing → success/error`) |
| `useMemo` | `ProductDetailPage` (image dedup), `ProductListPage` (filtered/sorted list), `HomePage` (filtered products), `OrderDetailPage` (timeline steps), `AuthPage` (formatted mobile string) |
| `useCallback` | `HomePage` (category select, product click handlers), `useChat` (loadChats, loadMessages, sendMessage), `useFetch` (execute function) |
| `useRef` | `ChatPage` (input focus, bottom-scroll ref), `AuthPage` (OTP input refs array, submit guard), `Navbar` (dropdown outside-click ref) |
| `useContext` | Via `useAuth()` — used in all protected pages to access user and auth functions |

---

## Custom Hooks

All hooks are in `src/hooks/`.

### `useLocalStorage(key, initialValue)`
Syncs a state value with `localStorage`. Initializes from stored value on first render. Writes to `localStorage` in a `useEffect` whenever the value changes. Used by the Navbar location selector so the chosen state persists across sessions.

```js
const [location, setLocation] = useLocalStorage('zyro_location', 'All India');
```

### `useDebounce(value, delay = 400)`
Returns a debounced copy of `value` that only updates after `delay` ms of inactivity. Uses `useEffect` with a `setTimeout` and cleanup.

```js
const debouncedQuery = useDebounce(searchInput, 400);
```

### `useFetch(fetchFn, deps)`
Generic data-fetching hook. Wraps any async function with `loading`, `error`, and `data` state. The `fetchFn` is memoized with `useCallback` over `deps`. Exposes a `refetch` function.

```js
const { data, loading, error, refetch } = useFetch(() => productsAPI.getProducts(), []);
```

### `useForm(initialValues, validate)`
Form state manager. Tracks `values`, `errors`, and `touched` (which fields the user has interacted with). Runs `validate(values)` on blur and on submit. Only shows errors for fields that have been touched.

```js
const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
  { email: '', name: '' },
  (v) => v.name.length < 2 ? { name: 'Too short' } : {}
);
```

### `useChat(activeChatId)`
Loads the chat list on mount. When `activeChatId` is set, loads its messages immediately. Exposes `sendMessage(content)`, which appends the new message to local state and refreshes the chat list.

```js
const { chats, messages, loadingChats, loadingMessages, sendMessage } = useChat(chatId);
```

### `useOrders()`
Fetches buying and selling orders in parallel using `Promise.all`. Exposes `confirmDelivery(orderId)` which calls the API and refetches. Returns `{ buying, selling, loading, error, confirmDelivery, refetch }`.

### `useProducts(filters)`
Fetches products with `search`, `state`, and `category` query params when provided, then applies a lightweight client-side safety filter. A companion `useProduct(id)` fetches a single product.

### `useWallet()`
Fetches wallet balance and transaction ledger. Exposes `addFunds(amount)` which updates balance optimistically.

---

## Components

### Common (`src/components/common/`)

**`Avatar`** — Circular avatar. If a URL is provided it renders an `<img>`. Otherwise it shows the first letter of the name on a solid `bg-indigo-600` background. Sizes: `sm` (32px), `md` (40px), `lg` (64px), `xl` (96px).

**`Badge`** — Small colored pill. Variants map to background + text color combos (verified = green, escrow = indigo, etc.).

**`Button`** — Reusable button. Props: `variant` (primary / secondary / ghost / danger), `size` (sm / md / lg), `loading` (shows spinner), `fullWidth`, `icon`. Renders a `<button>` with appropriate Tailwind classes.

**`Modal`** — Centered dialog with a semi-transparent backdrop. Controlled by `isOpen`/`onClose` props. Supports `maxWidth` (sm / md / lg). Renders via a portal at `document.body`.

**`SkeletonLoader`** — Shimmer placeholder. Variants: `card` (full product card shape), `text` (single line), `list-item` (horizontal row). Used on every page that fetches data.

**`EmptyState`** — Centered empty-list placeholder. Props: `title`, `subtitle`, optional `icon`, optional `actionLabel` + `onAction` for a CTA button.

**`ErrorCard`** — Red-bordered card showing an error message with a "Try again" button. Accepts `message` and `onRetry`.

**`ErrorBoundary`** — The only class component in the project. Catches runtime errors in any child subtree using `getDerivedStateFromError` + `componentDidCatch`. Shows a "Refresh Page" fallback UI. Wraps the entire app in `main.jsx`.

**`Navbar`** — Sticky top bar. Left: logo. Center: location selector (33 Indian states, persisted to localStorage) + search bar (navigates to `/products?q=...&state=...`). Right: Chat → Wallet → Notifications icons + profile avatar (hover opens dropdown with name, verified badge, My Profile, Orders, and Logout).

**`Layout`** — Wraps all protected pages. Renders `<Navbar>` at the top, `<Outlet>` for page content, and `<BottomMobileNav>` on mobile.

**`StatusTimeline`** — Visual step-by-step timeline for order status (Created → Paid → Shipped → Delivered → Completed). Active step is highlighted.

### Product (`src/components/product/`)

**`ProductCard`** — Grid card showing product image, title, price, seller name, verified badge, location, and condition chip. Clicking navigates to `/products/:id`.

---

## API Layer

### Structure

```
src/api/
├── config.js       USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
├── client.js       Axios instance — base URL, Bearer token header, 401 redirect
├── index.js        Conditionally exports mock or real modules
├── mock/           Client-side simulation (no network)
└── real/           Actual HTTP calls to Spring Boot API Gateway
```

### Methods (same signature in mock and real)

**`authAPI`**
- `sendOTP(mobile)` — Send OTP to mobile number
- `verifyOTP(mobile, otp)` → `{ user, token }` — Verify and get session
- `getCurrentUser()` → `user` — Fetch profile from token
- `updateProfile(payload)` → `user` — Update name/email
- `becomeSeller()` — Set `isVerified = true`

**`productsAPI`**
- `getProducts(params)` → paginated list; supports `page`, `size`, `search`, `state`, and `category`
- `getProduct(id)` → single product
- `getMyListings()` → current user's listings
- `createProduct(payload)` → draft product
- `publishProduct(id)` — Set status to PUBLISHED

**`ordersAPI`**
- `createOrder(payload)` → order — Initiates escrow hold
- `getBuyingOrders()` → orders[]
- `getSellingOrders()` → orders[]
- `getOrder(id)` → order
- `confirmDelivery(id)` — Release escrow to seller
- `raiseDispute(id, reason)` — Open dispute
- `cancelOrder(id)` — Cancel before shipment

**`chatAPI`**
- `getChats()` → chats[]
- `getMessages(chatId)` → messages[]
- `sendMessage(chatId, content)` → message
- `createChat(productId, sellerId)` → chat

**`walletAPI`**
- `getBalance()` → `{ balance }`
- `getLedger()` → transactions[]
- `addFunds(amount)` → updated balance

### Axios Client (`client.js`)
- Base URL: `VITE_API_BASE_URL` (default `http://localhost:8080/api/v1`)
- Request interceptor: attaches `Authorization: Bearer <token>` from localStorage
- Response interceptor: on 401/403, clears session and redirects to `/auth`

---

## Auth Context

`src/context/AuthContext.jsx` provides session state to the entire app via React Context.

**State provided:**
- `user` — Current user object (id, fullName, mobile, email, isVerified, walletBalance)
- `token` — JWT string
- `isAuthenticated` — Boolean
- `loading` — True while hydrating session from localStorage on first load

**Functions provided:**
- `sendOTP(mobile)` — Request OTP
- `verifyOTP(mobile, otp)` — Verify OTP and set session
- `setSession(user, token)` — Manually set session (used in mock login)
- `refreshUser()` — Re-fetch current user from API
- `updateUser(payload)` — Update profile and sync context state
- `becomeSeller()` — Mark user as verified
- `logout()` — Clear localStorage and reset state

**Session persistence:** Token and user are stored in `localStorage` under `zyro_auth_token` and `zyro_user`. On app mount, if a token exists, `getCurrentUser()` is called to hydrate the session. An AbortController cancels the request if the component unmounts before it resolves.

---

## Design System

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-primary` | `#6366F1` (Indigo 500) | Buttons, active states, links |
| `--color-secondary` | `#06B6D4` (Cyan 500) | Accents, gradients |
| `--color-ink` | `#111827` (Gray 900) | Body text |
| `--color-surface` | `#F8FAFC` | Page backgrounds |
| `--color-muted` | `#94A3B8` | Placeholder text, labels |
| Emerald / Green | `from-emerald-500 to-green-600` | Wallet balance card |
| Indigo 50 | `bg-indigo-50` | Escrow info boxes, active nav |
| Rose / Red | `text-rose-600`, `bg-rose-50` | Errors, destructive actions |
| Amber | `bg-amber-50` | KYC coming-soon card |

### Typography

- **Headings**: Plus Jakarta Sans (black weight, `font-black`)
- **Body**: Inter
- **Prices**: `text-indigo-600 font-black`

### Utility Classes (defined in `index.css`)

- `.page-shell` — `max-w-7xl mx-auto px-4 py-8` (page content wrapper)
- `.animate-fade-slide-up` — fade + upward slide on mount
- `.animate-fade-in` — opacity 0 → 1
- `.animate-shimmer` — skeleton loader shimmer
- `.animate-shake` — horizontal shake for validation errors
- `.input` — standard text input with focus ring
- `.input-error` — red border + shake animation
- `.card` — white rounded card with border and soft shadow
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost` — button base classes

---

## Animations & CSS

All keyframe animations are defined in `src/index.css` and exposed as Tailwind utility classes:

| Class | Effect |
|-------|--------|
| `animate-fade-slide-up` | Opacity + Y translate (page entry) |
| `animate-fade-in` | Simple fade |
| `animate-scale-in` | Scale from 0.95 + fade |
| `animate-shimmer` | Background sweep (skeleton loaders) |
| `animate-pulse-ring` | Expanding ring (notification dot) |
| `animate-float-soft` | Gentle vertical float |
| `animate-shake` | Horizontal shake (form errors) |
| `animate-slide-in-right` | Slide from right edge |

Stagger delays: `.animation-delay-100` through `.animation-delay-500` (steps of 100ms).

---

## Development Workflow

1. Install dependencies with `npm install`.
2. Run `npm run dev` in mock mode while developing UI and flows.
3. Run `npm run lint` before opening a pull request.
4. Run `npm run build` to verify the production bundle.
5. Keep API changes isolated to `src/api/` and preserve the shared mock/real API signatures.

Available scripts:

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint with warnings treated as errors |

## Contribution Notes

- Keep changes focused and avoid committing generated files, local environment files, or editor settings.
- Do not commit `node_modules`, `dist`, coverage reports, logs, or temporary files.
- Preserve existing routes, API contracts, and mock-mode support unless a change explicitly requires otherwise.
- Add or update mock data when a new frontend flow needs deterministic data.
- Include a short description of the user-facing behavior and the validation commands you ran.

---

## Backend Integration Notes

The backend is 4 Spring Boot microservices behind an API Gateway:

| Service | Port | Responsibility |
|---------|------|---------------|
| api-gateway | 8080 | All frontend requests go here |
| auth-service | 8081 | OTP, JWT, user profiles |
| product-service | 8082 | Listings CRUD |
| order-service | 8083 | Orders, escrow, wallet, chat |

Database: Supabase Postgres (external, shared across services).

To switch from mock to live:
1. Start all 4 Spring Boot services
2. Set `VITE_USE_MOCK=false` in `.env`
3. Run `npm run dev`

No frontend code changes are needed — the API layer handles the switch transparently.

---

## Mock Data

Seeded in `src/api/mock/`:

- **8 products** across Electronics, Fashion, Home, Books, Sports, Collectibles, Other
- **1 default user** (Ganesh, verified seller, ₹7,500 wallet balance)
- **Sample orders** in various escrow states (HELD, RELEASED, DISPUTED)
- **Chat history** with escrow request messages
- **Wallet ledger** with credit/debit transactions

Default mock login: any mobile number + any 6-digit OTP.
To simulate an unverified user: use a mobile number ending in `0000`.
