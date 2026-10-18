# Milestone 11 Documentation: Coupons & Discount Engine

## Executive Summary
Milestone 11 implements the complete Coupons and Discount Engine module (`/api/v1/coupons/*`, `/api/v1/cart/applyCoupon`) for the Clothing Store backend.
- Full Admin CRUD management over coupons with strict Role-Based Access Control (`ADMIN` role only).
- Multi-rule coupon validation: expiration timestamp checking, global usage limit checking, and minimum order threshold enforcement.
- Support for both `PERCENTAGE` discounts (with DB CHECK constraint <= 100%) and `FIXED` amount discounts.
- Seamless integration with the Cart module via both `PUT /api/v1/cart/applyCoupon` and `POST /api/v1/cart/applyCoupon`.

---

## 1. Implemented Endpoints & Contract Compliance

| Endpoint | Method | Auth Required | Description | Status |
|---|---|---|---|---|
| `/api/v1/coupons` | `GET` | Admin | List coupons with pagination and usage tracking | **VERIFIED ✅** |
| `/api/v1/coupons/:id` | `GET` | Admin | Get single coupon details | **VERIFIED ✅** |
| `/api/v1/coupons` | `POST` | Admin | Create coupon (code, type, value, minOrder, limit, expiry) | **VERIFIED ✅** |
| `/api/v1/coupons/:id` | `PUT` | Admin | Update coupon properties | **VERIFIED ✅** |
| `/api/v1/coupons/:id` | `DELETE` | Admin | Delete coupon | **VERIFIED ✅** |
| `/api/v1/cart/applyCoupon` | `PUT` | User | Apply coupon code to user's active cart | **VERIFIED ✅** |
| `/api/v1/cart/applyCoupon` | `POST` | User | Apply coupon code fallback endpoint | **VERIFIED ✅** |

---

## 2. Key Architecture Details

1. **Validation Pipeline:**
   - Case-insensitive coupon code normalization (`code.trim().toUpperCase()`).
   - Ensures percentage discounts cannot exceed 100% via both service-level validation and PostgreSQL database CHECK constraints.
   - Prevents empty carts from claiming coupons (`400 Bad Request`).
   - Verifies expiration against UTC server timestamps.
2. **Discount Clamping:**
   - Discount amount is capped so it can never exceed the total cart price.
   - Outputs both `totalPriceAfterDiscount` and `totalCartPriceAfterDiscount` for broad frontend compatibility.
3. **RBAC Protection:**
   - All `/api/v1/coupons/*` endpoints are protected by `JwtAuthGuard` and `RolesGuard(ADMIN)`. Non-admin users are strictly rejected with `403 Forbidden`.

---

## 3. Automated Test Verification Results

All 10 test cases in `test-milestone-11.ts` passed:
- `TC-M11-01`: User and admin authentication verified ✅
- `TC-M11-02`: Percentage discount coupon creation verified ✅
- `TC-M11-03`: Fixed discount coupon creation verified ✅
- `TC-M11-04`: Expired coupon creation verified ✅
- `TC-M11-05`: Over-100% percentage validation rejection verified ✅
- `TC-M11-06`: Non-admin RBAC 403 Forbidden protection verified ✅
- `TC-M11-07`: User cart setup verified ✅
- `TC-M11-08`: Apply percentage coupon with recalculated total verified ✅
- `TC-M11-09`: Expired coupon rejection on cart verified ✅
- `TC-M11-10`: Admin coupon update and deletion lifecycle verified ✅

---

## 4. Status
**Milestone 11 is 100% COMPLETE and INDEPENDENTLY VERIFIED.**
Ready for Milestone 12: Orders, Cash & Online Stripe Payments.
