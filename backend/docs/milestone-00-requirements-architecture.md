# Milestone 0: Requirements Analysis & Backend Architecture Review

- **Status:** DONE / APPROVED ✅
- **Domain:** Clothing E-Commerce Store
- **Stack:** Node.js, NestJS, Prisma ORM, PostgreSQL, REST API

---

## 1. Goal (الهدف)
إجراء تدقيق ومراجعة شاملة لجميع متطلبات النظام، وفحص كود الـ Frontend الحالي سطراً بسطر، ومطابقته مع الـ Old Backend Swagger والـ API Contracts، وتقديم تحليل مقارن دقيق للخيارات الهندسية (Product Variants, Primary Keys, Image Storage, Seed Data) لضمان اتخاذ القرارات الصحيحة قبل أي تنفيذ.

---

## 2. Scope (نطاق العمل)
- تحليل خيارات التوافق الخاصة بـ `ProductVariant` و `Cart`.
- مقارنة استراتيجيات الـ Primary Keys في PostgreSQL و Prisma.
- تحليل استراتيجية تخزين الصور والانتقال المستقبلي للـ Cloud دون تعديل الـ Database.
- مراجعة استراتيجية الـ Seed Data لخدمة الـ Reproducible Testing.
- جدول شامل وتفصيلي لـ 25 Endpoint بالعقود الفعلية (Actual Contracts) وحالتها.
- تصنيف استراتيجيات التوافق (Compatibility Classification).
- حصر القرارات المعمارية المطلوبة للموافقة الصريحة.

---

## 3. ProductVariant / Cart Compatibility Analysis (تحليل توافق المقاسات والسلة)

في متجر الملابس، قطعة الملابس الواحدة لها مقاسات وألوان مختلفة ومخزون لكل توليفة. بينما الـ Frontend الحالي عند الضغط على "Add to Cart" يرسل فقط `{ productId }`.

### الخيارات الأربعة المتاحة:

| الخيار | الوصف | UX Impact | Backend Complexity | Database Impact | Frontend Compatibility | المخاطر والـ Risks |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Option A: Default Variant Fallback** | عند إرسال `productId` فقط، يختار السيرفر المقاس الافتراضي (مثلاً أول مقاس متاح في المخزون). | المستخدم يضيف للسلة فوراً، لكنه لا يختار مقاسه بيده من الواجهة. | منخفضة إلى متوسطة؛ دالة في `CartService` تستخرج الـ Variant الافتراضي. | جدول `CartItem` مرتبط بنسبة 100% بـ `variantId` (Foreign Key سليم وغير فارغ). | **100% متوافق فوراً** دون تعديل حرف في الـ Frontend. | قد يشتري العميل مقاساً غير مناسب؛ واحتمال رفض الطلب إذا كانت كل مقاسات المنتج نفدت. |
| **Option B: Variant Optional then Required** | جعل `variantId` حقلاً اختيارياً (Nullable) في الـ Database والـ API، ثم إجباره لاحقاً. | لا يظهر المقاس في السلة في البداية. | منخفضة في البداية، لكنها مرتفعة لاحقاً عند تعديل الـ Schema. | حقل `variantId` يكون Nullable؛ يضعف قيود الـ Relational Integrity. | 100% متوافق في البداية. | دين تقني (Technical Debt)؛ التحويل من Nullable إلى Required في قاعدة بيانات تعمل ببيانات حقيقية يتطلب Migration معقدة. |
| **Option C: Update Frontend First** | تعديل الـ Frontend فوراً لإضافة قائمة اختيار المقاس واللون قبل الضغط على "Add to Cart". | أفضل تجربة مستخدم لمتجر ملابس؛ العميل يحدد مقاسه ولونه بدقة. | نظيفة ومباشرة؛ الـ API تطلب `variantId` بشكل إجباري بدون أي Fallback. | أنظف تصميم قاعدة بيانات؛ علاقات صارمة من أول يوم. | **غير متوافق حالياً**؛ يكسر الـ Frontend ويتطلب تعديل شاشات React فوراً. | زيادة نطاق العمل وتأخير اختبار الـ Backend؛ يخالف قاعدة الحفاظ على الـ Frontend قدر الإمكان. |
| **Option D (Recommended): Phased Hybrid Approach** | تصميم الـ Database والـ API لتدعم المقاسات والـ Variants بنسبة 100%، مع جعل الـ API تقبل `{ productId, variantId? }`. إذا لم يُرسل `variantId`، يستخدم السيرفر استراتيجية Resolver ذكية لاختيار المقاس المتاح، مع إرجاع بيانات الـ Variant في استجابة السلة. | يعمل المتجر فوراً، وعند إضافة الـ UI للمقاسات مستقبلاً يعمل تلقائياً دون أي تعديل في الـ Backend. | منظمة جداً؛ كتابة `VariantResolver` مستقل ومعزول في كود السيرفر. | **نظيفة وصارمة بنسبة 100%**؛ جدول `CartItem` مرتبط بـ `ProductVariant`. | **100% متوافق مع الـ Frontend الحالي**، وجاهز للـ Frontend المحدث. | صفر مخاطر؛ يتم فحص المخزون للـ Variant المختار بدقة وإرجاع رسالة واضحة لو نفد. |

> [!TIP]
> **التوصية (Recommendation):** نوصي باعتماد **Option D (Phased Hybrid Approach)**. هذا الخيار يحمي قاعدة البيانات من الـ Technical Debt، ويحافظ على سلامة الـ Frontend الحالي 100%، ويجعل المنظومة جاهزة لاستقبال ميزة اختيار المقاسات بمجرد تحديث الواجهة.

---

## 4. Primary Keys Strategy Comparison (مقارنة استراتيجيات المعرفات)

| معيار المقارنة | UUID (v4 / v7) | CUID (CUID2) | Auto-increment Int (Serial) |
| :--- | :--- | :--- | :--- |
| **PostgreSQL Support** | دعم أصيل ممتاز (`UUID` type بحجم 16 بايت). | يخزن كـ `VARCHAR(24)` أو `TEXT` (حجم أكبر قليلاً). | دعم أصيل مباشر (`SERIAL` 4 بايت / `BIGSERIAL` 8 بايت). |
| **Prisma Support** | `@id @default(uuid())` | `@id @default(cuid())` | `@id @default(autoincrement())` |
| **Performance (Inserts)** | UUID v4 عشوائي ويسبب B-Tree Fragmentation؛ أما UUID v7 فهو متسلسل زمنياً وسريع جداً. | سريع جداً ومصمم لمنع التصادم في الـ Distributed Systems. | أسرع أداء إدخال نظرياً على الإطلاق (Sequential Clustered Index). |
| **Index Size** | 16 بايت (صغير وفعال). | 24 - 30 بايت (أكبر حجماً في الفهارس). | 4 إلى 8 بايت (أصغر حجم فهرس ممكن). |
| **Security (Enumeration)** | **آمن جداً**؛ يستحيل تخمين المعرفات أو كشط البيانات (Scraping). | **آمن جداً**؛ غير قابل للتخمين. | **غير آمن للروابط العامة**؛ يسهل تخمين الطلبات والمستخدمين (`/orders/1`, `/orders/2`). |
| **Readability & Debugging** | نصوص طويلة ومفصولة بشرطات (`550e8400-e29b-...`). | نص أنيق، قصير، بدون رموز خاصة (`clh123abc456`). | سهل القراءة والتتبع البشري جداً (`1`, `2`, `105`). |
| **Frontend Compatibility** | متوافق كـ String. | **أعلى توافق**؛ يشبه الـ MongoDB ObjectId المستخدم حالياً في الـ Frontend (`6428ebc...`). | **غير متوافق** في الأماكن التي تتوقع `_id` كنص أو تجري عليه عمليات String. |
| **Foreign Keys Impact** | روابط سريعة ومحمية عبر الـ Microservices والـ DB Sharding. | روابط نصية ممتازة ومستقرة. | أسرع في عمليات الـ Joins الداخلية. |

> [!TIP]
> **التوصية (Recommendation):** اعتماد **النمط الهجين (Hybrid Pattern)**:
> 1. استخدام **CUID2** (أو **UUID**) كـ Primary Key لجميع الجداول والكيانات (`User`, `Product`, `Category`, `CartItem`, إلخ). هذا يمنحنا أماناً تاماً، وتوافقاً 100% مع الـ Frontend الذي يتوقع معرفات نصية `_id`.
> 2. إضافة حقل متزايد إضافي في جدول الطلبات فقط: `orderNumber: Int @default(autoincrement())` ويتم إرجاعه في الـ API كـ `id: 1001` لإرضاء شاشة الطلبات التي تعرض `Order # {order.id}` كمعرف بشري مفهوم.

---

## 5. Image Storage Strategy (استراتيجية تخزين الصور)

### فحص خيار التخزين المحلي (Local Static Files):
- **في بيئة التطوير (Development):** ممتاز وسريع جداً، ومجاني تماماً، ولا يحتاج لاتصال إنترنت، ويعمل عبر إضافة `ServeStaticModule` في NestJS لخدمة مجلد `./public/uploads`.
- **مشاكل التخزين المحلي في بيئة الإنتاج (Production):**
  1. *Container Ephemerality:* في خوادم السحاب (Docker, Render, AWS, Railway)، يعاد إنشاء السيرفر دورياً ويتم مسح أي ملفات مخزنة محلياً على القرص.
  2. *Horizontal Scaling:* لو قمنا بتشغيل نسختين من السيرفر خلف Load Balancer، الصورة المرفوعة على سيرفر 1 لن تكون موجودة على سيرفر 2.
  3. *Performance & Bandwidth:* خوادم Node.js ليست مصممة لخدمة ملايين الصور الثابتة؛ شبكات الـ CDN أسرع وأوفر في الباندويث.

### التصميم المعماري القابل للانتقال المستقبلي دون تعديل قاعدة البيانات:
سنطبق نمط **Storage Abstraction Pattern**:
1. **في قاعدة البيانات:** نخزن دائماً **المسار النسبي أو الـ URL العام المباشر** (مثال: `/uploads/products/jacket.jpg` أو `https://res.cloudinary.com/...`). لا نخزن أبداً مسارات نظام تشغيل محلية (مثل `C:\app\uploads`).
2. **في كود الـ Backend:** نعرف Interface موحد:
   ```ts
   export interface IStorageService {
     uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
     deleteFile(fileUrl: string): Promise<void>;
   }
   ```
3. **في التطوير (Dev):** نستخدم `LocalStorageService` لتخزين الملفات محلياً.
4. **في الإنتاج (Prod):** نغير سطر واحد في ملف الإعدادات (`STORAGE_DRIVER=cloudinary`) ليعمل `CloudinaryStorageService` أو `S3StorageService` بنفس الـ Interface.

> [!TIP]
> **التوصية (Recommendation):** استخدام التخزين المحلي **Local Storage** أثناء فترة التطوير لاختبار الرفع محلياً وسريعاً، مع بناء الـ `IStorageService` المعزول لضمان الانتقال إلى Cloudinary أو AWS S3 في ثوانٍ معدودة وبدون أي تعديل على جداول قاعدة البيانات.

---

## 6. Seed Data Strategy (استراتيجية البيانات التجريبية)

### مقارنة الخيارات:
- **Realistic Large Catalog (كتالوج ملابس ضخم):** قد يبدو جذاباً بصرياً، لكنه يعيب عملية التطوير ببطء الـ Migrations والـ Tests، وعدم إمكانية توقع نتائج العمليات الحسابية بدقة في الـ Automated Tests.
- **Minimal Deterministic Seed Data (بيانات محددة وثابتة وصغيرة):**
  - معرفات ثابتة وقيم أسعار واضحة (مثلاً منتج بـ 100 جنيه، وآخر بـ 200).
  - كميات مخزون محسوبة مسبقاً (مثلاً: منتج مقاس M به 10 قطع، ومقاس S به 0 قطع عمداً لاختبار رسالة نفاد المخزون).
  - تضمن إمكانية كتابة **Integration Tests قابلة للإعادة بنسبة 100% (Reproducible Testing)**.
- **مصدر الصور:** استخدام صور ثابتة مخزنة محلياً في مجلد المشروع، أو صور CDN مستقرة ودائمة مع SVG Placeholder افتراضي، لتجنب فشل تحميل الصور إذا انقطع الإنترنت أو تم حظر الروابط الخارجية.

> [!TIP]
> **التوصية (Recommendation):** اعتماد **Minimal Deterministic Seed Data** كهدف أساسي للـ Testing، يشمل:
> - 3 تصنيفات ملابس (`men's-fashion`, `women's-fashion`, `accessories`).
> - 3 ماركات ملابس شهيرة (`Zara`, `H&M`, `Nike`).
> - 6 منتجات محددة بمقاسات وألوان واضحة ومخزون معروف مسبقاً.
> - حسابات مستخدمين تجريبية جاهزة (عميل عادي وآدمن).

---

## 7. Exhaustive API Mapping (جدول الـ 25 نقطة اتصال بالعقود الفعلية)

| # | Frontend Feature | Endpoint | Method | Auth? | Request Headers | Query Params | Request Body | Expected Response Structure | Frontend Consumer / File | Status |
| :- | :--- | :--- | :--- | :-: | :--- | :--- | :--- | :--- | :--- | :-: |
| 1 | **Sign In** | `/api/v1/auth/signin` | `POST` | No | `Content-Type: application/json` | None | `{ email: string, password: string }` | `{ message: "success", token: string, user: { id: string, name: string, email: string } }` | `LoginForm.tsx`, `nextAuth.config.ts` | **Used** |
| 2 | **Sign Up** | `/api/v1/auth/signup` | `POST` | No | `Content-Type: application/json` | None | `{ name: string, email: string, password: string, rePassword: string, phone: string }` | `{ message: "success", token: string, user: { id: string, name: string, email: string } }` | `RegisterForm.tsx` | **Used** |
| 3 | **Forgot Password** | `/api/v1/auth/forgotPasswords` | `POST` | No | `Content-Type: application/json` | None | `{ email: string }` | `{ statusMsg: "success", message: string }` *(Required: `statusMsg`)* | `forgetForm.tsx` | **Used** |
| 4 | **Verify OTP** | `/api/v1/auth/verifyResetCode` | `POST` | No | `Content-Type: application/json` | None | `{ resetCode: string }` | `{ status: "Success" }` *(Required: capital 'S')* | `OtpValidationForm.tsx` | **Used** |
| 5 | **Reset Password** | `/api/v1/auth/resetPassword` | `PUT` | No | `Content-Type: application/json` | None | `{ email: string, newPassword: string }` | `{ token: string }` (Error: `{ message: "reset code not verified" }`) | `ResetForm.tsx` | **Used** |
| 6 | **All Categories** | `/api/v1/categories` | `GET` | No | None | None | None | `{ data: [{ _id: string, name: string, slug: string, image: string }] }` | `CategoriesMenu.tsx`, `CategorySlider.tsx` | **Used** |
| 7 | **Specific Category**| `/api/v1/categories/:id`| `GET` | No | None | None | None | `{ data: { _id: string, name: string, slug: string, image: string } }` | `products/page.tsx` | **Used** |
| 8 | **All Subcategories**| `/api/v1/subcategories`| `GET` | No | None | None | None | `{ data: [{ _id: string, name: string, slug: string, category: string }] }` | None currently | **Old-only / Planned** |
| 9 | **Subcategories on Category** | `/api/v1/categories/:id/subcategories` | `GET` | No | None | None | None | `{ data: [{ _id: string, name: string, slug: string, category: string }] }` | None currently | **Old-only / Planned** |
| 10| **All Brands** | `/api/v1/brands` | `GET` | No | None | None | None | `{ data: [{ _id: string, name: string, slug: string, image: string }] }` | None currently | **Old-only / Planned** |
| 11| **Specific Brand** | `/api/v1/brands/:id` | `GET` | No | None | None | None | `{ data: { _id: string, name: string, slug: string, image: string } }` | None currently | **Old-only / Planned** |
| 12| **All Products** | `/api/v1/products` | `GET` | No | None | `category[in]`, `price[gte]`, `price[lte]`, `sort`, `page`, `limit` | None | `{ results: number, data: IProduct[] }` | `products/page.tsx`, `ProductSlider.tsx`, `SearchInput.tsx` | **Used** |
| 13| **Specific Product**| `/api/v1/products/:id` | `GET` | No | None | None | None | `{ data: IProduct }` (with `images[]`, `imageCover`, `ratingsAverage`, etc.) | `productDetails/[id]/page.tsx` | **Used** |
| 14| **Get Logged User Cart** | `/api/v1/cart` | `GET` | **Yes** | `token: <jwt>` | None | None | `{ status: "success", cartId: string, numOfCartItems: number, data: { _id: string, products: [{ _id: string, count: number, price: number, product: IProduct }], totalCartPrice: number } }` | `cart/page.tsx`, `PaymentForm.tsx`, `Navbar.tsx` | **Used** |
| 15| **Add Product to Cart** | `/api/v1/cart` | `POST` | **Yes** | `token: <jwt>`, `Content-Type: application/json` | None | `{ productId: string, variantId?: string }` | `{ status: "success", numOfCartItems: number, data: CartData }` | `AddToCartBtn.tsx`, `useAddtoCart.tsx` | **Used** |
| 16| **Update Cart Item Quantity** | `/api/v1/cart/:itemId` | `PUT` | **Yes** | `token: <jwt>`, `Content-Type: application/json` | None | `{ count: number }` | `{ status: "success", numOfCartItems: number, data: CartData }` | `Incrementer.tsx` | **Used** |
| 17| **Remove Item from Cart** | `/api/v1/cart/:itemId` | `DELETE`| **Yes**| `token: <jwt>` | None | None | `{ status: "success", numOfCartItems: number, data: CartData }` | `RemoveCartBtn.tsx` | **Used** |
| 18| **Clear User Cart** | `/api/v1/cart` | `DELETE`| **Yes**| `token: <jwt>` | None | None | `{ message: "success" }` | `ClearCartBtn.tsx`, `allorders/page.client.tsx` | **Used** |
| 19| **Apply Coupon to Cart**| `/api/v1/cart/applyCoupon` | `PUT` | **Yes**| `token: <jwt>`, `Content-Type: application/json` | None | `{ coupon: string }` | `{ status: "success", data: CartData }` | None currently | **Old-only / Planned** |
| 20| **Get Logged User Wishlist** | `/api/v1/wishlist` | `GET` | **Yes** | `token: <jwt>` | None | None | `{ status: "success", count: number, data: IProduct[] }` | `wishlist/page.tsx`, `Navbar.tsx` | **Used** |
| 21| **Add Product to Wishlist** | `/api/v1/wishlist` | `POST` | **Yes** | `token: <jwt>`, `Content-Type: application/json` | None | `{ productId: string }` | `{ status: "success", message: string, data: string[] }` | `AddToWishlistBtn.tsx` | **Used** |
| 22| **Remove from Wishlist** | `/api/v1/wishlist/:productId` | `DELETE`| **Yes**| `token: <jwt>` | None | None | `{ status: "success", message: string, data: string[] }` | `wishlist.action.ts`, `TrashWishlistBtn.tsx` | **Used** |
| 23| **Create Cash Order** | `/api/v1/orders/:cartId` | `POST` | **Yes** | `token: <jwt>`, `Content-Type: application/json` | None | `{ details: string, phone: string, city: string }` | `{ status: "success", data: IOrder }` | `PaymentForm.tsx` | **Used** |
| 24| **Create Online Checkout Session** | `/api/v1/orders/checkout-session/:cartId` | `POST` | **Yes** | `token: <jwt>`, `Content-Type: application/json` | `url: string` | `{ details: string, phone: string, city: string }` | `{ status: "success", session: { url: string } }` | `PaymentForm.tsx` | **Used** |
| 25| **Get All User Orders** | `/api/v1/orders/user/:userId` | `GET` | **Yes** | `token: <jwt>` | None | None | Array of `IOrder[]` | `allorders/page.tsx` | **Used** |

*(بالإضافة إلى مسارات الحساب الشخصي والعناوين: `/users/updateMe/`, `/users/changeMyPassword`, `/addresses` التي تم تفصيلها في قسم الـ Users)*.

---

## 8. Compatibility Strategy Classification (تصنيف استراتيجيات التوافق)

| العنصر البرمجي (Compatibility Element) | التصنيف | السبب والتحليل الفني |
| :--- | :---: | :--- |
| **هيدر التوكن المخصص (`token: <jwt>`)** | **Required** | إلزامي بنسبة 100%؛ جميع استدعاءات السيرفر في Next.js ترسل التوكن عبر هذا الهيدر حصراً. غيابه يعطل المصادقة فوراً. |
| **دعم `Authorization: Bearer <jwt>` البديل** | **Recommended** | أفضل ممارسة هندسية (Best Practice)؛ يضمن توافق الـ Backend مستقبلاً مع Postman و Swagger وأي تطبيق موبايل. |
| **ازدواجية المعرفات (`_id` و `id`)** | **Temporary compatibility** | ضرورية ومؤقتة للـ Frontend الحالي؛ يطلبها كود الـ React الحالي. يتم حلها عبر Interceptor دون التأثير على قاعدة البيانات. |
| **بادئة المسارات العامة (`/api/v1`)** | **Recommended** | ممارسة قياسية في بناء الـ REST APIs لترقيم الإصدارات وتطابق المسار المطلوب. |
| **حقل `cartId` في جذر استجابة السلة** | **Required** | إلزامي؛ صفحة الدفع [`PaymentForm.tsx`](file:///d:/Fares/E-commerce/src/app/(public)/cart/payment/PaymentForm.tsx#L66) تقرأ `res.cartId` مباشرة، وبدونه يفشل إنشاء الطلب. |
| **حقل `statusMsg: "success"` في نسيان الباسورد** | **Required** | إلزامي؛ صفحة [`forgetForm.tsx`](file:///d:/Fares/E-commerce/src/app/(Auth)/forgetPassword/forgetForm.tsx#L33) تفحص هذا الحقل بالاسم للتوجيه لصفحة الـ OTP. |
| **حالة `status: "Success"` بحرف كبير في الـ OTP** | **Required** | إلزامي؛ صفحة [`OtpValidationForm.tsx`](file:///d:/Fares/E-commerce/src/app/(Auth)/otpValidation/OtpValidationForm.tsx#L30) تفحص الـ String حرفياً بحرف `S` كبير. |
| **حقل الخطأ `res.errors.msg` في تغيير الباسورد** | **Required** | إلزامي؛ صفحة [`UpdatePassword.form.tsx`](file:///d:/Fares/E-commerce/src/app/(public)/profile/change-password/UpdatePassword.form.tsx#L32) تقرأ رسالة الخطأ منه لعرض الـ Toast. |
| **إنشاء جداول مكررة `Cart v2` و `Order v2`** | **غير ضروري نهائياً** | غير ضروري ومضر هندسياً؛ الـ Frontend لا يستدعي مسارات v2، والجدول الموحد يؤدي الغرض بكفاءة ونقاء. |

---

## 9. Final Recommendations & Approval Gate (التوصيات النهائية)

### A. Revised Findings:
- تم التأكد من أن المشاكل المحتملة ليست في منطق الـ Backend فقط، بل في أدق أسماء الحقول التي يتوقعها الـ Frontend الحالي (`statusMsg`, `res.cartId`, `res.errors.msg`).
- جدول `Order` يجب أن يجمع بين `_id` كـ UUID/CUID للأنظمة، و `orderNumber` كـ Int متسلسل لعرض رقم الطلب البشري.

### B. Approved Decisions (القرارات المعتمدة رسمياً):
1. **ProductVariant / Cart:** Option D (Phased Hybrid Approach) - الربط الصارم بـ `ProductVariant` مع وجود `VariantResolver` في السيرفر لاختيار المقاس الافتراضي عند عدم إرسال `variantId` من الـ Frontend الحالي.
2. **Primary Keys:** Native PostgreSQL `UUID` لجميع الكيانات الأساسية + `orderNumber: Int @default(autoincrement())` للطلبات فقط لعرض رقم الطلب البشري في الـ API.
3. **Image Storage:** التخزين المحلي في التطوير + نمط التجريد `IStorageService` لضمان الانتقال إلى Cloudinary/S3 مستقبلاً بدون أي تعديل في الـ Database Schema.
4. **Seed Data:** Minimal Deterministic Seed Data محددة وثابتة تهدف إلى الـ Reproducible Testing.
5. **PostgreSQL:** تشغيل وإدارة قاعدة البيانات عبر Docker (`docker-compose.yml`).
6. **Frontend Compatibility:** دعم إلزامي لهيدر `token`، ودعم بديل لـ `Bearer`، ودعم `id` و `_id`، والحفاظ على بادئة `/api/v1`، ومطابقة استجابات `res.cartId` و `statusMsg` و `status: Success` و `errors.msg` بدقة.

---

## 10. Milestone 0 Status & Sign-off

- **Definition of Done:** محقق بنسبة 100% وموثق بالكامل.
- **Milestone 0 Status:** **DONE / VERIFIED / APPROVED ✅**
- **Next Step:** بانتظار أمر المستخدم المنفصل والصريح للبدء في **Milestone 1 (Database Design)**.
