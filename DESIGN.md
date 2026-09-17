# Hakuna Potata — Design System & Architecture Specification

**Hakuna Potata Artisan Bakery & Custom Cake Studio**  
*Dhaka, Bangladesh · [hakunabakery.vercel.app](https://hakunabakery.vercel.app)*  
*Crafted by [@nonamedevs](https://nonamedevs.vercel.app)*

---

## 1. Brand Essence & Aesthetic Direction

Hakuna Potata is an artisan custom cake studio and bakery specializing in bespoke Korean Bento cakes, intricate Vintage Lambeth piping, and multi-tier celebratory towers. The digital experience reflects the brand's culinary craft:

- **Minimalist European Luxury**: High contrast typography, generous negative space, warm off-white canvas (`#faf9f6`), and soft ivory/charcoal tonal balance.
- **Tactile Craftsmanship**: Imagery takes center stage with subtle shadows, crisp borders, and refined micro-interactions.
- **Bespoke Cake Studio Experience**: A multi-phase interactive builder allowing customers to visualize size, sponge, fillings, dietary customization, and color palettes in real-time.
- **Auditory Atmosphere**: A curated lo-fi ambient soundtrack toggleable directly in the navigation bar to evoke a cozy European café feeling.

---

## 2. Color Palette & Theming

| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| **Canvas Background** | `#faf9f6` | Warm artisan paper tone, easier on the eyes than pure `#fff` |
| **Surface Card** | `#ffffff` | Elevated component cards, dialogs, summaries |
| **Card Subdued** | `#f5f4ef` / `bg-neutral-50` | Input backgrounds, nested summary items |
| **Primary Ink** | `#111111` / `#1a1a1a` | High-contrast headings, primary buttons |
| **Secondary Text** | `#737373` (`text-neutral-500`) | Descriptions, labels, secondary metadata |
| **Muted Borders** | `#e5e5e5` (`border-neutral-200`) | Subtle architectural dividing lines |
| **Accent Emerald** | `#059669` / `#10b981` | Order success states, WhatsApp brand accent, live badges |
| **Warm Amber** | `#d97706` / `#b45309` | Multi-tier cake alerts, dietary badges |

---

## 3. Typography Hierarchy

- **Display & Brand Headings**: `Syne`, `Playfair Display`, or system modern geometric serif fallbacks (`font-display`).
- **Body & Interface**: Clean modern system sans-serif (`-apple-system`, `BlinkMacSystemFont`, `Inter`, `Segoe UI`, `Roboto`).
- **Technical & Pricing**: Monospace font family (`font-mono`) for exact dimensions (e.g. `6″`, `12-16 servings`, `৳2,800`, `#HKP-123456`).

---

## 4. Layout & Mobile-First Principles

1. **Strict Mobile Optimization**:
   - Single-hand ergonomic reach for touch controls.
   - Sticky action bars with thumb-friendly tappable heights (minimum 44px touch targets).
   - Fluid auto-collapsing CSS grids from single-column mobile up to 4-column desktop layouts.
2. **Phase-Driven Studio Flow**:
   - **Phase 1: Cake Architecture & Dimensions**: Interactive selection between 4″ Bento, 6″ Popular, 8″ Best Seller, 10″ Feast, or Two-Tier Towers.
   - **Phase 2: Flavors, Fillings & Dietary Customization**: Flavor selection, 100% pure eggless option toggle (+৳250), personalized inscriptions, reference image uploading, delivery zone selection, and customer contact data.
   - **Order Confirmation & Invoicing**: Automated calculation of base cake + dietary fee + regional courier delivery fee, with instant dispatch to customer email and bakery notification.
3. **Persistent Floating Utilities**:
   - **Ambient Audio Pill**: Discreet sound control with volume state retention.
   - **Quick WhatsApp Concierge**: Instant direct chat routing with pre-filled order specifications.
   - **Attribution Badge**: Made by `@nonamedevs` ([nonamedevs.vercel.app](https://nonamedevs.vercel.app)).

---

## 5. Performance & Size Budget (<1MB Limit)

The entire production distribution is engineered under a **strict < 1.0 MB bundle size constraint**:

- **Production Dist Target**: < 1,024 KB (Current: `~908 KB`).
- **Asset Compression**:
  - Image assets converted to compressed modern `.webp` format.
  - Audio asset compressed to compact mono ambient stream.
  - SVG iconography bundled via tree-shakeable `lucide-react`.
- **CSS Architecture**: Tailwind CSS v4 with LightningCSS optimization and zero runtime overhead.
- **Code Splitting**: Rollup/Vite dynamic code chunking for modular route distribution (`/` home and `/order` standalone size guide).

---

## 6. Notification & Invoicing Architecture

- **Engine**: Brevo SMTP Relay & REST API (`https://api.brevo.com/v3/smtp/email`).
- **Dual Delivery Pipeline**:
  1. **Customer Invoice Email**: Elegant, responsive HTML invoice with formal invoice ID, itemized cost breakdown, scheduled delivery time, delivery zone, and direct WhatsApp confirmation button.
  2. **Bakery Operations Alert**: Instant staff notification sent to `hakunapotatabakery@gmail.com` with complete customization parameters, inscriptions, and customer contact information.
