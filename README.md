# A & I — Commerce Platform

Production scaffold for the A & I storefront: **OMS · CMS · Vendor management · role-scoped Vendor Portal**, Razorpay/UPI checkout, accounts + order history, programmatic SEO, QR/NFC garment passport, WhatsApp/Instagram/SMS integration hooks, and an LLM styling assistant.

Stack: **Next.js 14 (App Router) · Prisma · PostgreSQL · Auth.js v5 · Razorpay · Anthropic**.

## Quick start
```bash
cp .env.example .env        # fill in DATABASE_URL, AUTH_SECRET, Razorpay + Anthropic keys
npm install
npm run db:push             # create tables
npm run db:seed             # admin + 2 vendors + sample products
npm run dev
```
Seed logins (password `password123`): `admin@aandi.com`, `vendor@jaipur.in`, `vendor@kutch.in`.

## Roles & access
- **/admin** (ADMIN only): dashboard/analytics, Orders (OMS), Catalogue (CMS), Vendors.
- **/vendor** (VENDOR only): dashboard, **My Orders** and **My Products** — every query is `vendorScope()`-filtered to the signed-in vendor, so a vendor can never see another vendor's data. Enforced twice: in `src/middleware.ts` (route) and `src/lib/rbac.ts` (data).
- **/account** (any signed-in user): order history, saved sizes, wishlist.

## Where things live
| Concern | File |
|---|---|
| Data model | `prisma/schema.prisma` |
| Auth + roles | `src/lib/auth.ts`, `src/middleware.ts` |
| Vendor scoping | `src/lib/rbac.ts` (`vendorScope`) |
| Checkout (server re-pricing + Razorpay order) | `src/app/api/checkout/route.ts` |
| Payment webhook (mark paid, decrement stock, mint passports, WhatsApp) | `src/app/api/webhooks/razorpay/route.ts` |
| OMS / CMS / Vendor APIs | `src/app/api/{orders,products,vendors}/route.ts` |
| Vendor-scoped API | `src/app/api/vendor/orders/route.ts` |
| LLM stylist | `src/lib/stylist.ts` + `src/app/api/stylist/route.ts` |
| Garment passport (QR/NFC) | `src/lib/passport.ts` + `src/app/passport/[serial]/page.tsx` |
| Programmatic SEO | `src/app/(store)/shop/[category]/page.tsx`, `src/lib/seo.ts`, `src/app/sitemap.ts` |
| Integrations (WhatsApp/IG/SMS) | `src/lib/integrations.ts` + `src/app/api/integrations/*` |

## Porting the storefront UI
The polished artifact (`App.jsx`) is the **view layer**. Move its section components (hero, rails, PDP, cart, etc.) into `src/app/(store)/**`, and swap the hard-coded `DL`/`IMG` arrays for DB calls (`prisma.product.findMany`). Upload the base64 images to object storage (S3/Cloudinary) and store URLs in `ProductImage`.

## Razorpay setup
1. Add keys to `.env`. 2. In the Razorpay dashboard add a webhook → `https://yourdomain/api/webhooks/razorpay` for `payment.captured` & `order.paid`, using `RAZORPAY_WEBHOOK_SECRET`. UPI/cards/netbanking all flow through the same Checkout.

## Not included (intentional, needs infra/secrets)
Live payment credentials, real SMTP/SMS provider, S3 bucket, immutable-ledger backing for passports, and CI/CD. All have clear TODOs in the relevant files.
