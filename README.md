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

## 📁 Project Structure

```
Brevita/
├── db/                       # Relational database schemas & seeding
│   ├── schema.sql            # SQLite database table definitions
│   └── seed.js               # Seed script for 86 worldwide dishes
├── middleware/               # Security & JWT authorization
│   └── auth.js               # JWT authentication middleware
├── routes/                   # RESTful API endpoints
│   ├── auth.js               # Registration, login, profile endpoints
│   ├── menu.js               # Menu query and pairing recommendations
│   ├── cart.js               # Cart items, suggestions & calculations
│   ├── orders.js             # Order placement, status & history
│   └── support.js            # Customer concierge message handling
├── public/                   # Frontend client assets
│   ├── css/                  # Glassmorphic modular stylesheets
│   ├── js/                   # ES6 modules for UI, state & animations
│   ├── images/dishes/        # 86 authentic high-res culinary photos
│   ├── video/                # Cinematic background video
│   └── index.html            # Single-page application entry point
├── scripts/                  # Data ingestion & image utilities
├── tests/                    # End-to-end Playwright test suites
├── server.js                 # Express application entry point
├── package.json              # Project dependencies & scripts
└── README.md                 # Project documentation
```

---

## ⚜️ Credits & Author

<div align="center">

### **Lucky Bodar**
*Concept, Architecture & Design*

[![GitHub](https://img.shields.io/badge/GitHub-lucky2729-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lucky2729)

> *"Conceived, architected, and brought to life with a passion for world culinary gastronomy, single-origin roasteries, and modern glassmorphic web aesthetics."*

</div>

---

## 📄 License
MIT License © 2026 **Lucky Bodar** & Brevita Roasters. All rights reserved.
