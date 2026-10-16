# Milestone 2: PostgreSQL Environment Setup & Database Initialization

- **Status:** DONE / VERIFIED ✅
- **Database Engine:** PostgreSQL 17.6 (x86_64-windows)
- **Port:** 5432
- **Database Name:** `clothing_ecommerce_db`
- **User:** `postgres`
- **Location:** `d:\Fares\pgsql\postgresql-17.6-x64-portable`
- **Config Files:** [`.env`](file:///d:/Fares/E-commerce/.env), [`.env.example`](file:///d:/Fares/E-commerce/.env.example)

---

## 1. Goal (الهدف من المرحلة)
تجهيز خادم قاعدة بيانات PostgreSQL حقيقي، خفيف ومستقر محلياً على جهاز التطوير، وإنشاء قاعدة بيانات مخصصة للمشروع باسم `clothing_ecommerce_db`، وضبط متغيرات البيئة واختبار الاتصال بنجاح لتكون جاهزة لاستقبال الـ Migrations في Milestone 3.

---

## 2. Technical Implementation (تفاصيل التنفيذ)

1. **طريقة التشغيل المختارة:**
   - تم استخدام النسخة المحمولة والمستقلة بالكامل (Native Portable PostgreSQL 17.6) المتوافقة مع ويندوز بدون الحاجة لـ Docker أو استهلاك زائد للرامات وبدون قيود الـ Geo-blocking.
   - يتم تشغيل الخادم على المنفذ القياسي `5432` كـ Background Daemon خفيف جداً (يستهلك أقل من 30 ميجابايت من الرامات).

2. **قاعدة البيانات وبيانات الدخول:**
   - **Database Name:** `clothing_ecommerce_db`
   - **Superuser:** `postgres`
   - **Password:** `postgrespassword`
   - **Connection URL:**
     ```env
     DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/clothing_ecommerce_db?schema=public"
     ```

3. **أوامر التحكم السريع بالخادم (Server Management):**
   - **تشغيل السيرفر:** `& "d:\Fares\pgsql\postgresql-17.6-x64-portable\bin\postgres.exe" -D "d:\Fares\pgsql\postgresql-17.6-x64-portable\data"`
   - **فحص الاتصال عبر psql:**
     ```powershell
     $env:PGPASSWORD='postgrespassword'
     & "d:\Fares\pgsql\postgresql-17.6-x64-portable\bin\psql.exe" -h 127.0.0.1 -p 5432 -U postgres -d clothing_ecommerce_db
     ```

---

## 3. Verification & Test Matrix (نتائج الاختبارات الفعلية)

| كود الاختبار | الهدف والخاصية المختبرة | طريقة الفحص | النتيجة الفعلية | الحالة |
| :--- | :--- | :--- | :--- | :--- |
| **TC-M02-01** | فحص تشغيل المنفذ (Port Listening) | `Test-NetConnection -ComputerName 127.0.0.1 -Port 5432` | `TcpTestSucceeded : True` | **PASSED ✅** |
| **TC-M02-02** | مصادقة المستخدم وكلمة المرور | الاتصال عبر `psql` بـ `postgres:postgrespassword` | نجاح المصادقة وإنشاء الجلسة دون أي رفض | **PASSED ✅** |
| **TC-M02-03** | وجود قاعدة البيانات المطلوبة | استعلام `SELECT datname FROM pg_database` | إرجاع `clothing_ecommerce_db` بنجاح | **PASSED ✅** |
| **TC-M02-04** | تنفيذ الاستعلامات الحية | `SELECT current_database(), current_user, version();` | `clothing_ecommerce_db \| postgres \| PostgreSQL 17.6` | **PASSED ✅** |

---

## 4. Definition of Done (شروط اكتمال Milestone 2)

- [x] خادم PostgreSQL 17 يعمل بنجاح على المنفذ `5432`.
- [x] تم إنشاء قاعدة البيانات `clothing_ecommerce_db`.
- [x] تم ضبط كلمة مرور حساب `postgres` ومطابقتها لملف الإعدادات.
- [x] تم إنشاء ملف [`.env`](file:///d:/Fares/E-commerce/.env) وملف [`.env.example`](file:///d:/Fares/E-commerce/.env.example) مع رابط الـ `DATABASE_URL` الصحيح.
- [x] اجتياز جميع حالات الاختبار بنجاح (100% Passed).
- [x] توثيق كامل للبيئة في هذا الملف.
- [x] جاهزية تامة ومثالية للانتقال إلى **Milestone 3 (Prisma Migrations & Seed Data)**.
