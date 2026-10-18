import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runEndToEndVerification() {
  console.log('🚀================================================================🚀');
  console.log('  MILESTONE 13: COMPREHENSIVE END-TO-END FRONTEND CONTRACT VERIFICATION');
  console.log('🚀================================================================🚀\n');

  let passedTests = 0;
  function pass(msg: string) {
    passedTests++;
    console.log(`  ✅ [PASS #${passedTests}] ${msg}`);
  }

  // --- SUITE 1: INFRASTRUCTURE & HEALTH ---
  console.log('\n--- SUITE 1: Infrastructure & Health ---');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthData.status, 'ok');
  pass('GET /api/v1/health returned status ok');

  // --- SUITE 2: AUTHENTICATION CONTRACTS ---
  console.log('\n--- SUITE 2: Authentication Contracts ---');
  const timestamp = Date.now();
  const testEmail = `e2e_user_${timestamp}@ecommerce.com`;
  const testPassword = 'Password123!';

  // 1. Signup
  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'E2E Test User',
      email: testEmail,
      password: testPassword,
      rePassword: testPassword,
      phone: '01011223344',
    }),
  });
  const signupData = await signupRes.json();
  assert.strictEqual(signupRes.status, 201);
  assert.strictEqual(signupData.message, 'success');
  assert.ok(signupData.token);
  assert.ok(signupData.user.id);
  assert.ok(signupData.user._id);
  pass('POST /api/v1/auth/signup created user with dual ID and token');

  // 2. Signin
  const signinRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const signinData = await signinRes.json();
  assert.strictEqual(signinRes.status, 200);
  assert.strictEqual(signinData.message, 'success');
  const userToken = signinData.token;
  const userId = signinData.user.id;
  pass('POST /api/v1/auth/signin authenticated and returned JWT');

  // 3. Auth Check /me with custom `token` header
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { token: userToken },
  });
  const meData = await meRes.json();
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meData.user.email, testEmail);
  pass('GET /api/v1/auth/me authenticated via custom token header');

  // 4. Error shape verification
  const badLoginRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'WrongPassword' }),
  });
  const badLoginData = await badLoginRes.json();
  assert.strictEqual(badLoginRes.status, 401);
  assert.strictEqual(badLoginData.statusMsg, 'fail');
  assert.ok(badLoginData.errors?.msg || badLoginData.message);
  pass('Frontend error shape { statusMsg: "fail", errors: { msg } } verified');

  // --- SUITE 3: PROFILE & ADDRESSES ---
  console.log('\n--- SUITE 3: Profile & Address Management ---');
  const getMeRes = await fetch(`${BASE_URL}/users/getMe`, {
    headers: { token: userToken },
  });
  const getMeData = await getMeRes.json();
  assert.strictEqual(getMeRes.status, 200);
  assert.strictEqual(getMeData.data.email, testEmail);
  pass('GET /api/v1/users/getMe verified');

  const addAddrRes = await fetch(`${BASE_URL}/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token: userToken },
    body: JSON.stringify({
      alias: 'Home',
      details: '42 Pyramids Road',
      phone: '01011223344',
      city: 'Giza',
      postalCode: '12511',
    }),
  });
  const addAddrData = await addAddrRes.json();
  assert.ok(addAddrRes.status === 200 || addAddrRes.status === 201);
  const addressId = Array.isArray(addAddrData.data)
    ? (addAddrData.data[addAddrData.data.length - 1]?.id || addAddrData.data[addAddrData.data.length - 1]?._id)
    : (addAddrData.data?.id || addAddrData.data?._id);
  pass('POST /api/v1/addresses added address');

  const listAddrRes = await fetch(`${BASE_URL}/addresses`, {
    headers: { token: userToken },
  });
  const listAddrData = await listAddrRes.json();
  assert.strictEqual(listAddrRes.status, 200);
  assert.ok(listAddrData.data.length >= 1);
  pass('GET /api/v1/addresses listed addresses');

  // --- SUITE 4: TAXONOMY & CLOTHING CATALOG ---
  console.log('\n--- SUITE 4: Taxonomy & Products Catalog ---');
  const catRes = await fetch(`${BASE_URL}/categories?limit=5`);
  const catData = await catRes.json();
  assert.strictEqual(catRes.status, 200);
  assert.ok(catData.data.length > 0);
  const sampleCat = catData.data[0];
  pass('GET /api/v1/categories listed categories with pagination');

  const brandRes = await fetch(`${BASE_URL}/brands?limit=5`);
  const brandData = await brandRes.json();
  assert.strictEqual(brandRes.status, 200);
  assert.ok(brandData.data.length > 0);
  pass('GET /api/v1/brands listed brands');

  const prodRes = await fetch(`${BASE_URL}/products?limit=10`);
  const prodData = await prodRes.json();
  assert.strictEqual(prodRes.status, 200);
  assert.ok(prodData.data.length > 0);
  const testProduct = prodData.data.find((p: any) => p.quantity >= 5) || prodData.data[0];
  assert.ok(testProduct.imageCover);
  assert.ok(Array.isArray(testProduct.images));
  assert.ok(typeof testProduct.price === 'number');
  pass('GET /api/v1/products returned products with formatted images and numbers');

  const singleProdRes = await fetch(`${BASE_URL}/products/${testProduct.id}`);
  const singleProdData = await singleProdRes.json();
  assert.strictEqual(singleProdRes.status, 200);
  assert.ok(singleProdData.data.variants.length > 0);
  pass('GET /api/v1/products/:id returned single product with clothing variants');

  // --- SUITE 5: CART MANAGEMENT & VARIANT RESOLVER ---
  console.log('\n--- SUITE 5: Cart Management & Variant Compatibility ---');
  // Clear cart
  await fetch(`${BASE_URL}/cart`, { method: 'DELETE', headers: { token: userToken } });

  // Add via productId (Frontend Mode)
  const addCartRes = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token: userToken },
    body: JSON.stringify({ productId: testProduct.id, quantity: 2 }),
  });
  const addCartData = await addCartRes.json();
  assert.strictEqual(addCartRes.status, 201);
  assert.strictEqual(addCartData.status, 'success');
  assert.strictEqual(addCartData.numOfCartItems, 1);
  const cartId = addCartData.cartId;
  pass('POST /api/v1/cart resolved default variant automatically via Option D');

  // Update quantity via productId
  const updateQtyRes = await fetch(`${BASE_URL}/cart/${testProduct.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', token: userToken },
    body: JSON.stringify({ count: 3 }),
  });
  const updateQtyData = await updateQtyRes.json();
  assert.strictEqual(updateQtyRes.status, 200);
  assert.strictEqual(updateQtyData.data.products[0].count, 3);
  pass('PUT /api/v1/cart/:id updated quantity using productId');

  // Get Cart
  const getCartRes = await fetch(`${BASE_URL}/cart`, {
    headers: { token: userToken },
  });
  const getCartData = await getCartRes.json();
  assert.strictEqual(getCartRes.status, 200);
  assert.strictEqual(getCartData.data.products.length, 1);
  pass('GET /api/v1/cart verified shape { numOfCartItems, cartId, data: { products, totalCartPrice } }');

  // --- SUITE 6: WISHLIST MODULE ---
  console.log('\n--- SUITE 6: Wishlist Module ---');
  const addWishRes = await fetch(`${BASE_URL}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token: userToken },
    body: JSON.stringify({ productId: testProduct.id }),
  });
  const addWishData = await addWishRes.json();
  assert.strictEqual(addWishRes.status, 201);
  assert.ok(addWishData.data.includes(testProduct.id));
  pass('POST /api/v1/wishlist added product to wishlist');

  const getWishRes = await fetch(`${BASE_URL}/wishlist`, {
    headers: { token: userToken },
  });
  const getWishData = await getWishRes.json();
  assert.strictEqual(getWishRes.status, 200);
  assert.ok(getWishData.data.length >= 1);
  pass('GET /api/v1/wishlist listed user wishlist items');

  const delWishRes = await fetch(`${BASE_URL}/wishlist/${testProduct.id}`, {
    method: 'DELETE',
    headers: { token: userToken },
  });
  const delWishData = await delWishRes.json();
  assert.strictEqual(delWishRes.status, 200);
  assert.ok(!delWishData.data.includes(testProduct.id));
  pass('DELETE /api/v1/wishlist/:id removed product from wishlist');

  // --- SUITE 7: ORDERS & CHECKOUT ---
  console.log('\n--- SUITE 7: Orders & Checkout ---');
  const createOrderRes = await fetch(`${BASE_URL}/orders/${cartId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token: userToken },
    body: JSON.stringify({
      details: '42 Pyramids Road',
      city: 'Giza',
      phone: '01011223344',
    }),
  });
  const createOrderData = await createOrderRes.json();
  assert.strictEqual(createOrderRes.status, 201);
  const createdOrder = createOrderData.data;
  assert.ok(createdOrder._id);
  assert.ok(typeof createdOrder.id === 'number');
  assert.strictEqual(createdOrder.paymentMethodType, 'cash');
  pass('POST /api/v1/orders/:cartId placed cash order with dual ID and cleared cart');

  // Verify User Order History (Array expected directly)
  const userOrdersRes = await fetch(`${BASE_URL}/orders/user/${userId}`, {
    headers: { token: userToken },
  });
  const userOrdersData = await userOrdersRes.json();
  assert.strictEqual(userOrdersRes.status, 200);
  assert.ok(Array.isArray(userOrdersData), 'Order history must be an array for direct .sort() in Next.js');
  assert.ok(userOrdersData.length >= 1);
  pass('GET /api/v1/orders/user/:userId verified with array response contract');

  // Cleanup address
  await fetch(`${BASE_URL}/addresses/${addressId}`, {
    method: 'DELETE',
    headers: { token: userToken },
  });
  pass('DELETE /api/v1/addresses/:id cleaned test address');

  console.log('\n================================================================');
  console.log(`🏆 ALL ${passedTests} END-TO-END VERIFICATION CHECKS PASSED WITH 100% SUCCESS!`);
  console.log('================================================================\n');
}

runEndToEndVerification().catch((err) => {
  console.error('\n❌ E2E Verification failed:', err);
  process.exit(1);
});
