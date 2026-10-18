# Milestone 6 Documentation: Users & Address Management

## Executive Summary
Milestone 6 implements the complete User Profile, Password Update, and Customer Shipping Address Management APIs (`/api/v1/users/*`, `/api/v1/addresses/*`). The implementation preserves strict compatibility with the Next.js 15 frontend forms (`UpdatePassword.form.tsx`, `AddressCardPayment.tsx`, `profile/page.tsx`, `redux/slices/Address.tsx`).

---

## 1. Implemented Endpoints & Contract Compliance

| Endpoint | Method | Auth Required | Request Body | Response Shape | Frontend Target | Status |
|---|---|---|---|---|---|---|
| `/api/v1/users/getMe` | `GET` | **Yes** | None | `{ data: { id, _id, name, email, phone, role, addresses } }` | `profile/page.tsx` | **VERIFIED ✅** |
| `/api/v1/users/updateMe` | `PUT` | **Yes** | `{ name?, email?, phone? }` | `{ status: "success", data: { user } }` | Profile editing | **VERIFIED ✅** |
| `/api/v1/users/changeMyPassword` | `PUT` | **Yes** | `{ currentPassword, password, rePassword }` | `{ token, user }` (or `{ statusMsg: "fail", errors: { msg } }`) | `UpdatePassword.form.tsx` | **VERIFIED ✅** |
| `/api/v1/addresses` | `POST` | **Yes** | `{ name/alias, details, phone, city, postalCode?, isDefault? }` | `{ status: "success", message: "Address added successfully", data: Address[] }` | `AddressCardPayment.tsx`, `redux/slices/Address.tsx` | **VERIFIED ✅** |
| `/api/v1/addresses` | `GET` | **Yes** | None | `{ status: "success", results: number, data: Address[] }` | Address lists & checkout | **VERIFIED ✅** |
| `/api/v1/addresses/:id` | `GET` | **Yes** | None | `{ status: "success", data: Address }` | Single address view | **VERIFIED ✅** |
| `/api/v1/addresses/:id` | `DELETE` | **Yes** | None | `{ status: "success", message: "Address removed successfully", data: Address[] }` | Delete address button | **VERIFIED ✅** |

---

## 2. Key Architecture Details

1. **Frontend Error Shape Alignment (`UpdatePassword.form.tsx`):**
   - The frontend form checks `res.errors.msg` directly.
   - When `currentPassword` fails, `BadRequestException` is formatted by `HttpExceptionFilter` to `{ statusMsg: "fail", errors: { msg: "Current password is incorrect" } }`.
2. **Address Name/Alias Fallback:**
   - Redux slice sometimes sends `name` instead of `alias`. DTO and Service seamlessly support both.
3. **Dual ID Interceptor:**
   - All addresses and user records include both `id` and `_id`.

---

## 3. Automated Test Verification Results

All 6 test cases in `test-milestone-06.ts` passed:
- `TC-M06-01`: Profile retrieval with addresses & dual IDs ✅
- `TC-M06-02`: User profile update (`name`, `phone`) ✅
- `TC-M06-03`: Change password validation, error shape check, and token reissue ✅
- `TC-M06-04`: Add address with alias fallback & automatic ID assignment ✅
- `TC-M06-05`: Get all addresses and specific address retrieval ✅
- `TC-M06-06`: Remove address and return remaining addresses ✅

---

## 4. Status
**Milestone 6 is 100% COMPLETE and INDEPENDENTLY VERIFIED.**
Ready for Milestone 7: Categories, Subcategories & Brands.
