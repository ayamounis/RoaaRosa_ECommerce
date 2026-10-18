import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('🧪 Starting Milestone 12: Orders & Payments Integration Tests...\n');

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
  const userId = userData.user?.id || userData.user?._id;

  const adminRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ecommerce.com', password: 'Admin123456' }),
  });
  const adminData = await adminRes.json();
  assert.strictEqual(adminRes.status, 200);
  const adminToken = adminData.token;
  console.log('✅ Tokens obtained.');

  // 2. Fetch product variant and record initial stock
  console.log('\nStep 2: Fetching product and initial variant stock...');
  const prodRes = await fetch(`${BASE_URL}/products?limit=1`);
  const prodData = await prodRes.json();
  const product = prodData.data[0];

  const variantsRes = await fetch(`${BASE_URL}/products/${product.id}/variants`);
  const variantsData = await variantsRes.json();
  const variant = variantsData.data[0];
  const initialStock = variant.stockQuantity;
  console.log(`Product: ${product.title}, Variant SKU: ${variant.sku}, Initial Stock: ${initialStock}`);

  // 3. Clear cart and add 2 units of variant
  console.log('\nStep 3: Setting up user cart with 2 units...');
  await fetch(`${BASE_URL}/cart`, { method: 'DELETE', headers: { token: userToken } });
  const addCartRes = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token: userToken },
    body: JSON.stringify({ variantId: variant.id, quantity: 2 }),
  });
  const addCartData = await addCartRes.json();
  assert.strictEqual(addCartRes.status, 201);
  const cartId = addCartData.cartId;
  assert.ok(cartId, 'cartId must be returned');
  console.log(`✅ Cart prepared with ID: ${cartId}`);

  // 4. Create Cash on Delivery order
  console.log('\nStep 4: Testing POST /orders/:cartId (Create Cash Order)...');
  const cashOrderRes = await fetch(`${BASE_URL}/orders/${cartId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify({
      shippingAddress: {
        details: '123 Nile Corniche, Apartment 4B',
        city: 'Cairo',
        phone: '01012345678',
        postalCode: '11511',
      },
    }),
  });
  const cashOrderData = await cashOrderRes.json();
  assert.strictEqual(cashOrderRes.status, 201);
  assert.strictEqual(cashOrderData.status, 'success');
  const order = cashOrderData.data;
  assert.ok(order._id, 'Order UUID must be present');
  assert.ok(typeof order.id === 'number', 'Order human-readable ID must be a number');
  assert.strictEqual(order.paymentMethodType, 'cash');
  assert.strictEqual(order.isPaid, false);
  assert.strictEqual(order.isDelivered, false);
  assert.strictEqual(order.shippingAddress.city, 'Cairo');
  assert.strictEqual(order.cartItems.length, 1);
  assert.strictEqual(order.cartItems[0].count, 2);
  assert.ok(order.cartItems[0].product.imageCover);
  console.log(`✅ Cash Order #${order.id} (UUID: ${order._id}) created successfully.`);

  // 5. Verify cart is cleared after order creation
  console.log('\nStep 5: Verifying user cart was cleared...');
  const cartCheckRes = await fetch(`${BASE_URL}/cart`, { headers: { token: userToken } });
  const cartCheckData = await cartCheckRes.json();
  assert.strictEqual(cartCheckData.numOfCartItems, 0);
  assert.strictEqual(cartCheckData.data.products.length, 0);
  console.log('✅ User cart verified empty.');

  // 6. Verify variant inventory was decremented
  console.log('\nStep 6: Verifying inventory decrement in database...');
  const varCheckRes = await fetch(`${BASE_URL}/products/${product.id}/variants`);
  const varCheckData = await varCheckRes.json();
  const refreshedVariant = varCheckData.data.find((v: any) => v.id === variant.id);
  assert.strictEqual(
    refreshedVariant.stockQuantity,
    initialStock - 2,
    'Stock should have decremented by 2',
  );
  console.log(`✅ Stock decremented from ${initialStock} to ${refreshedVariant.stockQuantity}.`);

  // 7. Test Stripe Checkout Session creation
  console.log('\nStep 7: Testing POST /orders/checkout-session/:cartId...');
  await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token: userToken },
    body: JSON.stringify({ variantId: variant.id, quantity: 1 }),
  });

  const stripeRes = await fetch(
    `${BASE_URL}/orders/checkout-session/${cartId}?url=http://localhost:3000`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: userToken,
      },
      body: JSON.stringify({
        details: 'Online Checkout Street',
        city: 'Alexandria',
        phone: '01198765432',
      }),
    },
  );
  const stripeData = await stripeRes.json();
  assert.strictEqual(stripeRes.status, 201);
  assert.strictEqual(stripeData.status, 'success');
  assert.ok(stripeData.session.url);
  assert.ok(stripeData.session.id);
  const sessionId = stripeData.session.id;
  console.log(`✅ Stripe session created: ${sessionId}`);

  // 8. Simulate successful online payment verification
  console.log('\nStep 8: Testing payment verification webhook/endpoint...');
  const verifyPayRes = await fetch(`${BASE_URL}/orders/verify-payment/${sessionId}`, {
    method: 'POST',
  });
  const verifyPayData = await verifyPayRes.json();
  assert.strictEqual(verifyPayRes.status, 201);
  assert.strictEqual(verifyPayData.data.isPaid, true);
  assert.ok(verifyPayData.data.paidAt);
  console.log(`✅ Payment verified, order marked paid at ${verifyPayData.data.paidAt}`);

  // 9. Query user orders (matching frontend: const orders = await getAllUserOrders(userId))
  console.log('\nStep 9: Testing GET /orders/user/:userId...');
  const userOrdersRes = await fetch(`${BASE_URL}/orders/user/${userId}`, {
    headers: { token: userToken },
  });
  const userOrders = await userOrdersRes.json();
  assert.strictEqual(userOrdersRes.status, 200);
  assert.ok(Array.isArray(userOrders), 'Response must be an array of orders directly for frontend');
  assert.ok(userOrders.length >= 2, 'Should contain at least 2 orders created');
  assert.ok(userOrders[0].id, 'Should contain order number');
  assert.ok(userOrders[0]._id, 'Should contain order UUID');
  assert.ok(userOrders[0].cartItems, 'Should contain cartItems');
  console.log(`✅ User orders fetched: ${userOrders.length} orders found.`);

  // 10. Admin marks order delivered
  console.log('\nStep 10: Admin testing PUT /orders/:id/deliver...');
  const deliverRes = await fetch(`${BASE_URL}/orders/${order._id}/deliver`, {
    method: 'PUT',
    headers: { token: adminToken },
  });
  const deliverData = await deliverRes.json();
  assert.strictEqual(deliverRes.status, 200);
  assert.strictEqual(deliverData.data.isDelivered, true);
  assert.ok(deliverData.data.deliveredAt);
  console.log('✅ Order marked delivered successfully by admin.');

  console.log('\n🎉 ALL 10 TEST CASES IN MILESTONE 12 PASSED WITH 100% SUCCESS!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
