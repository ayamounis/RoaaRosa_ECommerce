import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('🧪 Starting Milestone 11: Coupons & Discount Engine Tests...\n');

  // 1. Authenticate user and admin
  console.log('Step 1: Authenticating user & admin...');
  const userRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@ecommerce.com', password: 'User123456' }),
  });
  const userData = await userRes.json();
  assert.strictEqual(userRes.status, 200);
  const userToken = userData.token;

  const adminRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ecommerce.com', password: 'Admin123456' }),
  });
  const adminData = await adminRes.json();
  assert.strictEqual(adminRes.status, 200);
  const adminToken = adminData.token;
  console.log('✅ Tokens obtained.');

  const testSuffix = Date.now().toString().slice(-4);
  const codePercent = `PCT${testSuffix}`;
  const codeFixed = `FIX${testSuffix}`;
  const codeExpired = `EXP${testSuffix}`;

  // 2. Admin creates percentage coupon
  console.log('\nStep 2: Admin creating 20% discount coupon...');
  const createPctRes = await fetch(`${BASE_URL}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: adminToken,
    },
    body: JSON.stringify({
      code: codePercent,
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 100,
      usageLimit: 50,
    }),
  });
  const createPctData = await createPctRes.json();
  assert.strictEqual(createPctRes.status, 201);
  assert.strictEqual(createPctData.status, 'success');
  const pctCouponId = createPctData.data.id;
  assert.strictEqual(createPctData.data.code, codePercent);
  console.log(`✅ Percentage coupon ${codePercent} created.`);

  // 3. Admin creates fixed discount coupon
  console.log('\nStep 3: Admin creating 150 EGP fixed coupon...');
  const createFixRes = await fetch(`${BASE_URL}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: adminToken,
    },
    body: JSON.stringify({
      code: codeFixed,
      discountType: 'FIXED',
      discountValue: 150,
      minOrderValue: 500,
    }),
  });
  const createFixData = await createFixRes.json();
  assert.strictEqual(createFixRes.status, 201);
  console.log(`✅ Fixed coupon ${codeFixed} created.`);

  // 4. Admin creates expired coupon
  console.log('\nStep 4: Admin creating expired coupon...');
  const createExpRes = await fetch(`${BASE_URL}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: adminToken,
    },
    body: JSON.stringify({
      code: codeExpired,
      discountType: 'PERCENTAGE',
      discountValue: 10,
      expiresAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    }),
  });
  const createExpData = await createExpRes.json();
  assert.strictEqual(createExpRes.status, 201);
  console.log(`✅ Expired coupon ${codeExpired} created.`);

  // 5. Test percentage constraint (> 100% rejected)
  console.log('\nStep 5: Testing percentage > 100 rejection...');
  const overPctRes = await fetch(`${BASE_URL}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: adminToken,
    },
    body: JSON.stringify({
      code: `OVER${testSuffix}`,
      discountType: 'PERCENTAGE',
      discountValue: 150,
    }),
  });
  const overPctData = await overPctRes.json();
  assert.strictEqual(overPctRes.status, 400);
  assert.strictEqual(overPctData.statusMsg, 'fail');
  console.log('✅ Over 100% discount rejected properly.');

  // 6. Test RBAC: Non-admin cannot create coupon
  console.log('\nStep 6: Testing RBAC (non-admin forbidden)...');
  const userTryRes = await fetch(`${BASE_URL}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify({
      code: `HACK${testSuffix}`,
      discountType: 'PERCENTAGE',
      discountValue: 99,
    }),
  });
  assert.strictEqual(userTryRes.status, 403, 'Regular user should get 403 Forbidden');
  console.log('✅ RBAC properly enforced: regular user forbidden.');

  // 7. Prepare user cart
  console.log('\nStep 7: Preparing cart for coupon testing...');
  await fetch(`${BASE_URL}/cart`, { method: 'DELETE', headers: { token: userToken } });
  const prodRes = await fetch(`${BASE_URL}/products?limit=1`);
  const prodData = await prodRes.json();
  const product = prodData.data[0];

  await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token: userToken },
    body: JSON.stringify({ productId: product.id, quantity: 2 }),
  });
  console.log('✅ User cart prepared with items.');

  // 8. Apply percentage coupon to cart
  console.log('\nStep 8: Testing PUT /cart/applyCoupon with percentage coupon...');
  const applyPctRes = await fetch(`${BASE_URL}/cart/applyCoupon`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify({ coupon: codePercent }),
  });
  const applyPctData = await applyPctRes.json();
  assert.strictEqual(applyPctRes.status, 200);
  assert.strictEqual(applyPctData.message, 'Coupon applied successfully');
  assert.ok(applyPctData.data.totalPriceAfterDiscount < applyPctData.data.totalCartPrice);
  assert.strictEqual(applyPctData.data.appliedCoupon.code, codePercent);
  console.log(
    `✅ Coupon applied: Original=${applyPctData.data.totalCartPrice} EGP, After 20%=${applyPctData.data.totalPriceAfterDiscount} EGP`,
  );

  // 9. Apply expired coupon -> rejected with 400
  console.log('\nStep 9: Testing expired coupon rejection...');
  const applyExpRes = await fetch(`${BASE_URL}/cart/applyCoupon`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify({ coupon: codeExpired }),
  });
  const applyExpData = await applyExpRes.json();
  assert.strictEqual(applyExpRes.status, 400);
  assert.strictEqual(applyExpData.statusMsg, 'fail');
  console.log('✅ Expired coupon correctly rejected.');

  // 10. Admin updates & deletes coupon
  console.log('\nStep 10: Admin updating & deleting coupon...');
  const updateRes = await fetch(`${BASE_URL}/coupons/${pctCouponId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: adminToken,
    },
    body: JSON.stringify({ discountValue: 25 }),
  });
  const updateData = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateData.data.discountValue, 25);

  const delRes = await fetch(`${BASE_URL}/coupons/${pctCouponId}`, {
    method: 'DELETE',
    headers: { token: adminToken },
  });
  assert.strictEqual(delRes.status, 200);
  console.log('✅ Coupon successfully updated and deleted by admin.');

  console.log('\n🎉 ALL 10 TEST CASES IN MILESTONE 11 PASSED WITH 100% SUCCESS!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
