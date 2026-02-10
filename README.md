# TaiTam‑D — Luxury Next.js Site (Replacement for taitam-d.com)

This project is a **high-end, animation-heavy** marketing site designed to replace the current taitam-d.com while keeping **booking handled by Treatwell**.

## Tech
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animations)

## Quick start
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
npm run start
```

## Customize
All business content is centralized in:
- `lib/site.ts`

Update:
- name/description
- address/hours/phone
- Treatwell booking URL
- service categories

## Notes
- This site intentionally **does not duplicate Treatwell pricing/availability**. It links out to Treatwell for live booking.
- Academy remains a separate site: `https://taitamd-beautyacademy.com/`


## Image credits
Stock images are downloaded from Unsplash under the Unsplash License (free photos):
- /public/images/stock/spa-room.jpg
- /public/images/stock/waiting-area.jpg
- /public/images/stock/candle-bath.jpg
- /public/images/stock/candles-table.jpg
- /public/images/stock/white-candle.jpg
