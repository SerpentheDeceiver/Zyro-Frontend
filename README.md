# Zyro Frontend

Zyro is a **secure escrow-based peer-to-peer marketplace** that enables users to buy and sell products with trust. Funds are held safely in escrow until both buyer and seller complete the transaction.

This repository contains the **React frontend application** for Zyro.

---

##  Project Overview

Zyro focuses on solving trust issues in C2C marketplaces by introducing an **escrow system**:

* Buyer pays → money held in escrow
* Seller ships product
* Buyer confirms delivery
* Funds released to seller

---

## ✨ Features

###  Authentication (OTP-based)

* Login using mobile number + OTP
* No password-based authentication
* Session handled via JWT

---

###  Marketplace

* Browse products
* View product details
* Seller information display
* Escrow protection indicator

---

###  Chat System

* Real-time-like chat (polling every 5 seconds)
* Chat between buyer and seller per product
* Persistent conversation history

---

###  Orders & Escrow Flow

* Create order from product page
* Order lifecycle:

  * Created → Paid → Shipped → Delivered → Completed
* Buyer can:

  * Confirm delivery
* Seller cannot confirm delivery (restricted)

---

###  Wallet System

* View wallet balance
* Transaction history (ledger)
* Add funds
* Escrow balance tracking

---

###  Profile & Account

* View user profile
* Verified status
* Sidebar navigation (wallet, orders, listings)

---

### Seller Verification Guard

* Only **verified users** can:

  * Create listings
* Non-verified users are blocked from `/sell`

---

##  Tech Stack

* ⚛️ React (Vite)
* 🎨 Tailwind CSS
* 🔀 React Router
* 🌐 Axios (API communication)
* 🔔 React Hot Toast
* 🎯 Lucide Icons

---

## 📁 Project Structure

```
frontend/
│
├── public/
│   └── assets/
│
├── src/
│   ├── api/              # API layer (Axios + interceptors)
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── routes/           # Route guards
│   ├── context/          # Global state (Auth)
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🔗 API Configuration

All API requests are routed through the API Gateway:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Make sure backend services are running before starting frontend.

---

## ⚙️ Setup & Run

```bash
npm install
npm run dev
```

App will run at:

```
http://localhost:5173/
```

---

## 🔐 Route Overview

| Route           | Description                          |
| --------------- | ------------------------------------ |
| `/`             | Home / Marketplace                   |
| `/product/:id`  | Product details                      |
| `/chat/:chatId` | Chat system                          |
| `/wallet`       | Wallet dashboard                     |
| `/orders`       | Orders & escrow                      |
| `/profile`      | User profile                         |
| `/sell`         | Create listing (verified users only) |

---

##  Core Flow (Demo Ready)

###  Buying Flow

1. Open product
2. Click **Buy with Escrow**
3. Order created
4. Payment processed → escrow holds funds

---

###  Delivery Flow

1. Seller ships item
2. Buyer confirms receipt
3. Funds released to seller

---

###  Chat Flow

* Open `/chat/:chatId`
* Send message
* Messages update every 5 seconds

---

###  Access Control

* Non-verified users:

  * ❌ Cannot access `/sell`
* Verified users:

  * ✅ Can create listings

---

##  Design System

* Primary: `#6366F1` (Indigo)
* Secondary: `#06B6D4` (Cyan)
* Accent: `#10B981` (Mint)
* Background: `#F8FAFC`
* Font: **Plus Jakarta Sans + Inter**

---

##  Integration Notes

* Backend: Spring Boot Microservices

  * Auth Service
  * Product Service
  * Order Service
  * API Gateway

* Communication:

  * All requests go via API Gateway (`:8080`)

---

##  Important Notes

* `.env` is not committed (use `.env.example`)
* Ensure backend is running before testing flows
* Chat uses polling (not WebSocket for now)

---

## Frontend-Only Mode (Mock Mode)

Run the UI without backend services by enabling mock mode in `.env`:

```env
VITE_USE_MOCK=true
```

What this does:
- No backend/API dependency for login, products, chat, orders, or wallet screens.
- Data is simulated with realistic in-memory mock state.
- API error/service-unavailable toasts are suppressed in mock mode.

Quick start:

```bash
npm install
npm run dev
```

Switch back to full backend integration by setting:

```env
VITE_USE_MOCK=false
```

Mock seller guard testing:
- Default mock login is a verified user (`isVerified: true`).
- Use a mobile number ending in `0000` during login to simulate an unverified user (`isVerified: false`).
