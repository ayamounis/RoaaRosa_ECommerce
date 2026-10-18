# Milestone 4 Documentation: NestJS Project Setup & Global Architecture

## Executive Summary
Milestone 4 establishes the NestJS application core within `backend/`, connecting it globally to PostgreSQL via `PrismaService`, and implementing a pipeline (Validation, Exception Handling, CORS, Response Interception) specifically tuned for 100% contract compatibility with the existing Next.js frontend.

---

## 1. Architecture & Core Components Implemented

### 1.1 Directory Structure
```
backend/
├── src/
│   ├── app.module.ts              # Root Module (ConfigModule, PrismaModule, HealthModule)
│   ├── main.ts                    # Application bootstrap, Global Prefix, Pipes, Filters, CORS
│   ├── prisma/
│   │   ├── prisma.service.ts      # PrismaClient extension with lifecycle connection hooks
│   │   └── prisma.module.ts       # Global dynamic module exporting PrismaService
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Maps all HTTP errors to { statusMsg: "fail", message, errors: { msg } }
│   │   ├── interceptors/
│   │   │   └── response-transform.interceptor.ts # Dual _id <-> id mapping on all outgoing payloads
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts # @CurrentUser() param decorator
│   │   │   ├── public.decorator.ts       # @Public() auth bypass decorator
│   │   │   └── roles.decorator.ts        # @Roles() role-based access control decorator
│   │   └── dto/
│   │       └── pagination-query.dto.ts   # Reusable pagination, sorting, and keyword DTO
│   └── health/
│       ├── health.controller.ts   # GET /api/v1/health verifying live DB query
│       └── health.module.ts
├── prisma/
│   ├── schema.prisma              # 18-entity schema
│   ├── seed.ts                    # Deterministic database seeder
│   └── verify-seed.ts             # Milestone 3 verification suite
├── test-milestone-04.ts           # Milestone 4 automated integration test suite
├── package.json                   # Dependencies & start scripts
└── tsconfig.json                  # TypeScript 7 configuration
```

### 1.2 Global Configuration Highlights
1. **Global Prefix:** All endpoints are served under `/api/v1` to match Next.js frontend fetch calls.
2. **CORS & Authentication Header:**
   - Permitted Origins: `http://localhost:3000` and `http://127.0.0.1:3000`.
   - Permitted Custom Headers: `token` (Next.js custom auth header) alongside standard headers (`Authorization`, `Content-Type`).
   - Exposed Headers: `token`.
3. **Frontend-Compatible Error Filter (`HttpExceptionFilter`):**
   - Transforms all standard NestJS errors into the shape expected by frontend components (such as `UpdatePassword.form.tsx` and `forgetForm.tsx`):
     ```json
     {
       "statusMsg": "fail",
       "message": "Error details",
       "errors": { "msg": "Error details" },
       "statusCode": 404
     }
     ```
4. **Dual `_id` / `id` Interceptor (`ResponseTransformInterceptor`):**
   - Automatically injects `_id: id` into all outgoing responses without polluting PostgreSQL schema design, guaranteeing zero frontend breaking changes.
5. **Database Health Check (`GET /api/v1/health`):**
   - Executes live `SELECT 1` via `PrismaService`.

---

## 2. Automated Test Verification Results

The automated integration test suite (`backend/test-milestone-04.ts`) was executed against the running backend server:

| Test Case | Description | Expected | Result |
|---|---|---|---|
| **TC-M04-01** | Server Bootstrap & Port Listening | Server starts and accepts connections on port 5000 | **PASSED** (200 OK received) |
| **TC-M04-02** | PostgreSQL Connectivity via Health Check | `GET /api/v1/health` returns `database: "connected"` | **PASSED** (`SELECT 1` succeeded) |
| **TC-M04-03** | Frontend Error Shape Compatibility | 404 returns `{ statusMsg: "fail", errors: { msg } }` | **PASSED** (100% contract match) |
| **TC-M04-04** | CORS Preflight & `token` Header | Preflight OPTIONS returns `Access-Control-Allow-Headers: token` | **PASSED** (Origin & token header allowed) |
| **TC-M04-05** | Dual `_id` / `id` Interceptor | Outgoing entities have both `id` and `_id` | **PASSED** (Mapping verified) |

---

## 3. Status
**Milestone 4 is 100% COMPLETE and INDEPENDENTLY VERIFIED.**
Ready for sign-off to proceed to Milestone 5: Authentication Module (`/api/v1/auth/*`).
