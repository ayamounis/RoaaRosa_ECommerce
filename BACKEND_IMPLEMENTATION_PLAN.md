# Backend Implementation Plan: Clothing E-Commerce Store

## Goal Description
Rebuild the E-commerce backend using **NestJS**, **Prisma ORM**, **PostgreSQL**, and **Node.js** for a **Clothing Store** domain.
The new backend maintains maximum API compatibility with the existing Next.js frontend (matching its contracts, response shapes, and custom authentication header `token: <jwt>`) while providing a clean, strongly-typed architecture, proper inventory tracking for clothing sizes and colors, and future AI capabilities.

## Milestone Status Overview
- [x] **Milestone 0: Requirements Analysis & Backend Architecture Review** — **DONE / APPROVED ✅**
- [x] **Milestone 1: Database Design (18 Entities & Prisma Schema)** — **DONE / VERIFIED ✅**
- [x] **Milestone 2: PostgreSQL Setup (Environment & Connectivity)** — **DONE / VERIFIED ✅**
- [x] **Milestone 3: Prisma Migrations & Seed Data** — **DONE / VERIFIED ✅**
- [x] **Milestone 4: NestJS Project Setup & Global Architecture** — **DONE / VERIFIED ✅**
- [x] **Milestone 5: Authentication Module (`/api/v1/auth/*`)** — **DONE / VERIFIED ✅**
- [x] **Milestone 6: Users & Address Management (`/api/v1/users/*`, `/api/v1/addresses/*`)** — **DONE / VERIFIED ✅**
- [x] **Milestone 7: Categories, Subcategories & Brands** — **DONE / VERIFIED ✅**
- [x] **Milestone 8: Clothing Catalog & Product Variants (`/api/v1/products/*`)** — **DONE / VERIFIED ✅**
- [x] **Milestone 9: Cart Management & Variant Compatibility Layer (`/api/v1/cart/*`)** — **DONE / VERIFIED ✅**
- [x] **Milestone 10: Wishlist & Reviews Module (`/api/v1/wishlist/*`, `/api/v1/reviews/*`)** — **DONE / VERIFIED ✅**
- [x] **Milestone 11: Coupons & Discount Engine (`/api/v1/coupons/*`, `/api/v1/cart/applyCoupon`)** — **DONE / VERIFIED ✅**
- [x] **Milestone 12: Orders, Cash & Online Stripe Payments (`/api/v1/orders/*`)** — **DONE / VERIFIED ✅**
- [x] **Milestone 13: End-to-End API Verification with Next.js Frontend** — **DONE / VERIFIED ✅**

## Approved Architectural Decisions (Officially Recorded)
1. **ProductVariant / Cart**: **Option D (Phased Hybrid Approach)** — `CartItem` strictly references `ProductVariant`. Backend uses `VariantResolver` (deterministic: `ORDER BY createdAt ASC, id ASC`) as a Compatibility Layer when client sends only `productId`. API natively supports `variantId?` for future UI readiness.
2. **Primary Keys**: **Native PostgreSQL UUID** for all core entities via Prisma `@default(uuid())`. For `Order`, internal PK is `UUID` plus `orderNumber: Int @default(autoincrement())` exposed as human-friendly `id: 1001`.
3. **Image Storage**: Local storage during development with `IStorageService` abstraction; database stores URLs/paths. Cloudinary/S3 transition requires zero schema changes.
4. **Seed Data**: **Minimal Deterministic Seed Data** for reproducible integration testing.
5. **PostgreSQL Environment**: Managed via Native PostgreSQL 17 on Windows port 5432 (`clothing_ecommerce_db`).
6. **Frontend Compatibility**: Full preservation of `token` header, `Bearer` fallback, `/api/v1` prefix, dual `_id`/`id` mapping, root-level `res.cartId`, `statusMsg: "success"`, `status: "Success"`, and `res.errors.msg`. Single unified schema without duplicate Cart v2 / Order v2 tables.
7. **Database Integrity & Final Hardening (Milestone 1 & 3)**:
   - 18 entities modeled without contradictions in `prisma/schema.prisma`.
   - Migration `20261016212030_init_clothing_schema` deployed with 20 custom CHECK constraints + partial unique index `idx_product_variant_single_default`.
   - All verification tests passed cleanly.
8. **NestJS Architecture, Auth, Users, & Taxonomy (Milestones 4, 5, 6, 7)**:
   - Complete Authentication lifecycle tested and 100% verified.
   - Complete Profile & Address Management tested and 100% verified.
   - Complete Categories, Subcategories, & Brands tested and 100% verified with RESTRICT protection.
