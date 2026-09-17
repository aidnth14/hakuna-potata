# 🍰 Hakuna Potata — Artisan Bakery & Custom Cake Studio

> An ultra-lightweight, high-performance web experience and bespoke custom cake ordering studio for **Hakuna Potata Artisan Bakery**, Dhaka.

[![Production](https://img.shields.io/badge/Production-Live-emerald?style=flat-square)](https://hakunabakery.vercel.app)
[![Vercel](https://img.shields.io/badge/Vercel-hakunabakery.vercel.app-black?style=flat-square&logo=vercel)](https://hakunabakery.vercel.app)
[![Size Budget](https://img.shields.io/badge/Bundle%20Size-%3C1MB%20Strict-blue?style=flat-square)](https://hakunabakery.vercel.app)
[![Creator](https://img.shields.io/badge/Made%20by-%40nonamedevs-purple?style=flat-square)](https://nonamedevs.vercel.app)

---

## 🌟 Highlights & Key Features

- **🎨 Two-Phase Custom Cake Studio**:
  - **Phase 1: Architecture & Proportions**: Visual selection of single tiers (4″ Bento, 6″ Popular, 8″ Best Seller, 10″ Feast) and 2-layer stacked celebration towers.
  - **Phase 2: Flavor, Dietary & Aesthetic Customization**: Selection of artisan sponges (Belgian Chocolate, Vanilla Bean, Pistachio Rose, Red Velvet, Salted Caramel), fillings, 100% Pure Eggless toggle (+৳250), color palettes, custom inscriptions, and reference image uploads.
- **🧾 Customer Confirmation & Itemized Invoice System**:
  - Automatically generates and sends a luxury, branded HTML invoice to the customer's email upon order placement.
  - Simultaneously sends an operational dispatch notification to the bakery team at `hakunapotatabakery@gmail.com`.
- **💬 Direct WhatsApp Concierge**:
  - Pre-formats an itemized order summary for seamless one-tap confirmation via WhatsApp (+880 1339656675).
- **🎶 Ambient Audio Atmosphere**:
  - Persistent lo-fi bakery background soundtrack with play/mute controls.
- **⚡ Strict <1MB Bundle Size**:
  - Entire production build strictly optimized under 1MB (`~908 KB` total `dist`), with high-compression WebP visual assets.
- **📱 Mobile-First Ergonomics**:
  - Polished responsive design tailored for thumb reach and fast mobile checkout.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [LightningCSS](https://lightningcss.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Email & Invoicing** | [Brevo REST API & SMTP Relay](https://www.brevo.com/) |
| **Micro-Animations** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Deployment** | [Vercel](https://vercel.com/) Serverless Functions |

---

## 📁 Repository Structure

```
hakuna/
├── DESIGN.md                 # Design system & architecture specification
├── README.md                 # Comprehensive project overview & setup guide
├── llms.txt                  # Structured context standard for AI agents & LLMs
├── frontend/
│   ├── api/
│   │   └── send-order.js     # Vercel Serverless Function (Brevo email & invoice engine)
│   ├── public/
│   │   ├── cakes/            # Compressed WebP cake visual assets
│   │   ├── audio/            # Optimized ambient soundtrack
│   │   ├── logo.png          # Bakery logo
│   │   ├── favicon.png       # Web favicon
│   │   └── llms.txt          # Publicly served LLMs standard file
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomOrderPage.tsx   # Bespoke 2-phase cake studio & order flow
│   │   │   ├── CakeSizeReference.tsx # Interactive size guide & comparisons
│   │   │   ├── AudioPlayer.tsx       # Ambient sound widget
│   │   │   ├── WhatsAppButton.tsx    # Floating WhatsApp concierge button
│   │   │   └── WatermarkPill.tsx     # Attribution pill by @nonamedevs
│   │   ├── data/
│   │   │   └── cakeSizes.ts          # Specification data for tiers and towers
│   │   ├── App.tsx                   # Main storefront application
│   │   └── order.tsx                 # Dedicated size guide route (/order)
│   ├── index.html                    # Storefront HTML template
│   ├── order.html                    # Standalone size guide template
│   └── package.json
```

---

## 🔑 Environment Variables

To enable the Brevo order notification and customer invoice delivery system, configure these environment variables in `frontend/.env.local` (local) and Vercel Project Settings (production):

```env
BREVO_API_KEY=xkeysib-your-brevo-api-key
BREVO_SENDER_EMAIL=aiu.mailhub@gmail.com
BREVO_RECIPIENT_EMAIL=hakunapotatabakery@gmail.com
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation & Local Run

```bash
# Clone the repository
git clone https://github.com/aidnth14/hakuna-potata.git
cd hakuna-potata/frontend

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build & Size Check

```bash
# Compile and build production bundles
npm run build

# Verify build size remains under 1MB limit
du -k -d 1 dist
```

---

## 🌐 Production Deployment

The project is continuously deployed to Vercel:

```bash
npx vercel --prod --yes
npx vercel alias set <deployment-url> hakunabakery.vercel.app
```

- Production URL: **[https://hakunabakery.vercel.app](https://hakunabakery.vercel.app)**
- Contact Email: `hakunapotatabakery@gmail.com`
- WhatsApp Hotline: `+880 1339656675`

---

## 👨‍💻 Credits

Engineered with precision by **[@nonamedevs](https://nonamedevs.vercel.app)**.
