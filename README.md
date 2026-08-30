# ☕ BREVITA — Artisanal World Cafe & Roastery

> **Where Every Sip Tells a Story**  
> A full-stack luxury 3D animated web experience inspired by world gastronomy, single-origin coffee roasting, and The Cheesecake Factory’s expansive culinary repertoire.

---

## ✨ Features

- **🎬 Cinematic 3D Hero Experience**:
  - Smooth high-definition video background of espresso extraction with radial vignetting and film grain overlay.
  - Interactive **Chapter Story Mode** (*01 Terroir, 02 Precision, 03 Pressure, 04 Masterpiece*).
  - Dynamic, personalized time-of-day greeting (*"Hi, Lucy! Good Afternoon 🌤️"*) prominently centered in the top header.

- **🌍 Worldwide Culinary Tour (86 Gourmet Dishes)**:
  - Multi-region cuisine filtering: **🇯🇵 Japan**, **🇹🇷 Turkey**, **🇰🇷 Korea**, **🇮🇹 Italy**, **🇫🇷 France**, **🇲🇽 Mexico & Spain**, **🇮🇳 India**, **🇱🇧 Middle East**, and **🇺🇸 USA & Cheesecake Factory Classics**.
  - **100% Authentic Local Culinary Photography**: Zero stock/irrelevant images — all 86 dishes have dedicated high-resolution culinary photography bundled directly in the repository.

- **🟢 Official Veg & Non-Veg Dining Indicators**:
  - Classic restaurant-standard green square/dot (`🟢 Veg`) and red square/dot (`🔴 Non-Veg`) badges on every menu card, item modal, cart item, and checkout billing receipt.
  - Dedicated **Dietary Preference Filter Bar** (`All Dishes`, `🟢 Pure Veg`, `🔴 Non-Veg`).

- **🔍 Live Search & Multi-Level Filtering**:
  - Search by dish name, ingredients, calories, country, or tags in real-time.
  - Filter across course groups: *Coffees & Beverages*, *Starters, Pasta & Mains*, and *Cheesecakes & Desserts*.

- **🛒 Full Cart Drawer & Interactive Checkout**:
  - Slide-out glassmorphic cart drawer with live quantity adjustments and intelligent "Perfect Pairings" recommendations.
  - Complete checkout flow with Dine-In vs. Takeaway options, multiple payment methods, tax breakdown (CGST & SGST), and automated receipt generation (`#BRV-XXXXX`).

- **👤 User Account & Profile Management**:
  - One-click user sign-in / registration with phone validation.
  - Modal dashboard with user avatar, profile details, and complete order history with status tracking.

- **💬 Real-Time Concierge Support**:
  - Floating concierge chat bot with quick actions (*Track Order, Cancellation Policy, Modify Request, Connect with Host*).

- **🗺️ Global Roastery Flagships**:
  - Interactive showcase of Brevita Roasteries across Milan, Tokyo, Istanbul, Seoul, and San Francisco.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, Modern CSS3 (Glassmorphism, CSS Grid/Flexbox), ES6+ JavaScript Modules, Lucide Icons, GSAP & ScrollTrigger
- **Backend**: Node.js & Express.js REST API
- **Database**: SQLite3 via `better-sqlite3` with relational schema and automated seeds
- **Authentication**: Stateless JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Testing**: Automated end-to-end browser test suites with Playwright

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Brevita.git
cd Brevita
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed the Database
Populate SQLite database with all 86 gourmet dishes, ingredients, calories, prices, and verified culinary photos:
```bash
npm run seed
```

### 4. Start the Server
```bash
npm start
```

### 5. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** to experience Brevita.

---

## 📁 Project Structure

```
Brevita/
├── db/
│   ├── schema.sql            # SQLite database table definitions
│   └── seed.js               # Seed script for 86 worldwide dishes
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── routes/
│   ├── auth.js               # Registration, login, profile endpoints
│   ├── menu.js               # Menu query and pairing recommendations
│   ├── cart.js               # Cart items, suggestions & calculations
│   ├── orders.js             # Order placement, status & history
│   └── support.js            # Customer concierge message handling
├── public/
│   ├── css/
│   │   ├── base.css          # Design system, variables & resets
│   │   ├── hero.css          # Top navbar, hero story & highlights
│   │   ├── menu.css          # Menu grid, search, cuisine & dietary tabs
│   │   ├── cart.css          # Sliding glass cart drawer
│   │   ├── checkout.css      # Checkout flow & confirmation receipt
│   │   ├── support.css       # Concierge chat widget
│   │   └── locations.css     # Global roastery flagship cards
│   ├── js/
│   │   ├── app.js            # Main application bootstrap
│   │   ├── api.js            # API client wrapper
│   │   ├── greeting.js       # Dynamic header greeting
│   │   ├── menu.js           # Multi-dimensional filtering & search
│   │   ├── item-detail.js    # Dish modal details & pairings
│   │   ├── cart.js           # Cart state & drawer manager
│   │   ├── checkout.js       # Checkout form & order dispatcher
│   │   ├── profile.js        # Account dashboard & order history
│   │   ├── support.js        # Concierge chatbot
│   │   └── locations.js      # Global roastery locations
│   ├── images/
│   │   └── dishes/           # 86 local high-resolution food photos
│   ├── video/
│   │   └── espresso_pouring.mp4 # Cinematic background video
│   └── index.html            # Main single-page application entry
├── server.js                 # Express application entry point
├── package.json              # Project scripts and dependencies
└── README.md                 # Project documentation
```

---

## 📄 License
MIT License © 2026 Brevita Roasters & Cafe. All rights reserved.
