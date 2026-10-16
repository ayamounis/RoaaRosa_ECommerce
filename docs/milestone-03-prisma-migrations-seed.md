# Milestone 3 Documentation: Prisma Migrations & Seed Data

## Executive Summary
Milestone 3 establishes the automated database migration pipeline and deterministic seeding engine for the Clothing Store E-Commerce backend. Using Prisma 6.19.3 against our local PostgreSQL 17.6 database instance (`clothing_ecommerce_db`), we implemented the complete 18-entity relational schema alongside 20 custom database-level CHECK constraints and a partial unique index. Deterministic seed data was created, executed, and verified via an automated test suite.

---

## 1. Migration Details

### Migration Name
`20261016212030_init_clothing_schema`

### Location
- `backend/prisma/migrations/20261016212030_init_clothing_schema/migration.sql`
- `prisma/migrations/20261016212030_init_clothing_schema/migration.sql`

### Executed Artifacts
- **18 Tables:** `User`, `Address`, `Category`, `SubCategory`, `Brand`, `Product`, `ProductImage`, `Size`, `Color`, `ProductVariant`, `WishlistItem`, `Cart`, `CartItem`, `Coupon`, `Review`, `Order`, `OrderItem`, `Payment`.
- **Custom Partial Unique Index:**
  ```sql
  CREATE UNIQUE INDEX "idx_product_variant_single_default"
  ON "ProductVariant"("productId")
  WHERE "isDefault" = TRUE;
  ```
- **20 Custom PostgreSQL CHECK Constraints:**
  - Non-negative product pricing & discounts (`price >= 0`, `priceAfterDiscount >= 0`, `priceAfterDiscount <= price`)
  - Inventory sanity (`stockQuantity >= 0`, `sold >= 0`, `quantity >= 1`)
  - Rating boundary constraints (`rating BETWEEN 1 AND 5`, `ratingsAverage BETWEEN 0.0 AND 5.0`)
  - Coupon constraints (`discountValue > 0`, `usedCount >= 0`, `usageLimit >= 1`)
  - Settlement integrity (`subtotal >= 0`, `totalOrderPrice >= 0`, `amount >= 0`, equation equality).

---

## 2. Deterministic Seed Data Specification

The seed script (`backend/prisma/seed.ts`) populates fixed, predictable data for reproducible testing:

### 2.1 Users & Authentication
- **Administrator:**
  - Name: `System Admin`
  - Email: `admin@ecommerce.com`
  - Password: `Admin123456` (Hashed via `bcryptjs` with salt rounds = 10)
  - Phone: `+201000000001`
  - Role: `ADMIN`
- **Standard Customer:**
  - Name: `Mohamed Fares`
  - Email: `user@ecommerce.com`
  - Password: `User123456` (Hashed via `bcryptjs` with salt rounds = 10)
  - Phone: `+201000000002`
  - Role: `USER`
  - Default Address: `15 El-Tahrir Street, Apt 4B, Cairo, 11511`

### 2.2 Taxonomy
- **Categories (3):**
  - `Men's Fashion` (`men-fashion`)
  - `Women's Fashion` (`women-fashion`)
  - `Kids' Collection` (`kids-collection`)
- **SubCategories (6):**
  - Men: `Men T-Shirts`, `Men Pants`
  - Women: `Women Dresses`, `Women Tops`
  - Kids: `Boys Casual`, `Girls Casual`
- **Brands (3):**
  - `Zara`, `Nike`, `Adidas`

### 2.3 Clothing Variants Dimensions
- **Sizes (4):** Small (`S`), Medium (`M`), Large (`L`), X-Large (`XL`)
- **Colors (3):** Navy Blue (`#000080`), Black (`#000000`), White (`#FFFFFF`)

### 2.4 Catalog & Variants (6 Products, 12 Variants)
1. **Classic Cotton Crewneck T-Shirt** (Men / Men T-Shirts / Zara)
   - Price: 450 EGP, PriceAfterDiscount: 350 EGP
   - Variants:
     - S / Black (`TSH-COT-BLK-S`, Stock: 20, **Default**)
     - M / Black (`TSH-COT-BLK-M`, Stock: 15)
     - L / Navy Blue (`TSH-COT-NVY-L`, Stock: 10, PriceAdjustment: +20 EGP)
2. **Slim Fit Stretch Chino Pants** (Men / Men Pants / Zara)
   - Price: 850 EGP (No discount)
   - Variants:
     - M / Navy Blue (`PNT-CHN-NVY-M`, Stock: 25, **Default**)
     - L / Black (`PNT-CHN-BLK-L`, Stock: 18)
3. **Floral Tiered Summer Maxi Dress** (Women / Women Dresses / Zara)
   - Price: 1200 EGP, PriceAfterDiscount: 990 EGP
   - Variants:
     - S / White (`DRS-FLR-WHT-S`, Stock: 12, **Default**)
     - M / Navy Blue (`DRS-FLR-NVY-M`, Stock: 8, PriceAdjustment: +30 EGP)
4. **Sportswear Oversized Knit Pullover** (Women / Women Tops / Nike)
   - Price: 950 EGP (No discount)
   - Variants:
     - M / Black (`TOP-PLV-BLK-M`, Stock: 30, **Default**)
     - L / White (`TOP-PLV-WHT-L`, Stock: 22)
5. **Kids Active 3-Stripes Zip Hoodie** (Kids / Boys Casual / Adidas)
   - Price: 600 EGP, PriceAfterDiscount: 500 EGP
   - Variants:
     - S / Navy Blue (`KID-HOD-NVY-S`, Stock: 14, **Default**)
     - M / Black (`KID-HOD-BLK-M`, Stock: 16)
6. **Graphic Heritage Essential Tee** (Men / Men T-Shirts / Nike) — *Out of Stock Edge Case*
   - Price: 300 EGP (No discount)
   - Variants:
     - M / White (`TSH-GRP-WHT-M`, **Stock: 0**, **Default**)

### 2.5 Promotional Coupons (2)
- `WELCOME10`: 10% Discount, Min Order 200 EGP, Usage Limit 100, Valid for 1 year.
- `EGYPT50`: 50 EGP Fixed Discount, Min Order 500 EGP, Usage Limit 50, Valid for 1 year.

### 2.6 Customer Interactions
- **Wishlist:** Mohamed Fares added `Classic Cotton Crewneck T-Shirt`.
- **Review:** Mohamed Fares reviewed `Classic Cotton Crewneck T-Shirt` (Rating: 5/5).
- **Cart:** Mohamed Fares has an active Cart with 2 units of `TSH-COT-BLK-S` (Total: 700 EGP).

---

## 3. Verification & Automated Test Results

The automated test script (`backend/prisma/verify-seed.ts`) was executed against the database:

| Test Case | Description | Expected | Result |
|---|---|---|---|
| **TC-M03-01** | Deterministic Row Counts across all 18 Tables | Exact counts matching seed data | **PASSED** (100% Match) |
| **TC-M03-02** | Partial Unique Index Enforcement | Exactly 6 defaults, duplicate default rejected | **PASSED** (Postgres rejected duplicate with code `P2002`) |
| **TC-M03-03** | Custom CHECK Constraint Rejection | Negative stock and invalid discount rejected | **PASSED** (DB threw CHECK violation) |
| **TC-M03-04** | Bcrypt Password Verification | Admin and User passwords decrypt correctly | **PASSED** (Hashes verified against raw text) |
| **TC-M03-05** | Out of Stock Edge Case & Cart Linking | Variant stock = 0 verified, Cart relations intact | **PASSED** (Variant FKs fully verified) |

---

## 4. Status
**Milestone 3 is 100% COMPLETE and INDEPENDENTLY VERIFIED.**
Ready for user sign-off to proceed to Milestone 4: NestJS Project Setup & Global Architecture.
