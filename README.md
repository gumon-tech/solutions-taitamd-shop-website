# Taitam-D — Luxury Next.js Site (Replacement for taitam-d.com)

This project is a **high-end, animation-heavy** marketing site designed to replace the current taitam-d.com with **WhatsApp-first booking**.

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
- WhatsApp booking link and QR code
- service categories

## Notes
- Promotions are presented from the campaign artwork in `public/images/campaigns` and reservations open WhatsApp.
- Academy remains a separate site: `https://academy.taitam-d.com/`


## Image credits
No third-party stock photography ships with the site. The Unsplash images this section
used to credit were removed on 2026-08-12: no page had referenced them, and they were
untouched originals of 5000-6000px on a site that serves images raw and never renders
above 1600 (see docs/plans/ORPHANED-ASSETS.md).

Two notes for whoever adds the next credit here. Credit the file when it goes in, not
after — and delete the credit when the file goes, or it points at nothing. And be aware
that this section is deliberately outside the scope of scripts/check-orphan-assets.mjs:
while it was in scope, listing those five files to credit them was enough to make the
scanner report them as in use. A page that records where an image came from is not
evidence that anything uses it.
