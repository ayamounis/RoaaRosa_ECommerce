import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('🧪 Starting Tests for Dashboard, Customer Management, and AI Chatbot...\n');
  let passCount = 0;
  const totalTests = 7;

  // 1. Admin Login
  console.log('[1/7] Authenticating as Admin...');
  const adminRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ecommerce.com', password: 'Admin123456' }),
  });
  assert.strictEqual(adminRes.status, 200, 'Admin login should succeed');
  const adminData = await adminRes.json();
  const adminToken = adminData.token;
  console.log('✅ [1/7] Admin token obtained.');
  passCount++;

  // 2. Dashboard Overview API
  console.log('\n[2/7] Testing Dashboard Overview (GET /api/v1/dashboard)...');
  const dashRes = await fetch(`${BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(dashRes.status, 200, 'Dashboard overview should return 200');
  const dash = await dashRes.json();
  assert.ok(typeof dash.totalRevenue === 'number', 'totalRevenue must be a number');
  assert.ok(typeof dash.totalOrders === 'number', 'totalOrders must be a number');
  assert.ok(typeof dash.totalCustomers === 'number', 'totalCustomers must be a number');
  assert.ok(typeof dash.totalProducts === 'number', 'totalProducts must be a number');
  assert.ok(Array.isArray(dash.topSellingProducts), 'topSellingProducts must be an array');
  assert.ok(Array.isArray(dash.recentOrders), 'recentOrders must be an array');
  assert.ok(Array.isArray(dash.monthlySales), 'monthlySales must be an array');
  console.log(`✅ [2/7] Dashboard verified: Revenue=${dash.totalRevenue}, Customers=${dash.totalCustomers}, Products=${dash.totalProducts}`);
  passCount++;

  // 3. Admin Users List (Paginated & customer data)
  console.log('\n[3/7] Testing Admin Customers List (GET /api/v1/users)...');
  const usersRes = await fetch(`${BASE_URL}/users?page=1&limit=10`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(usersRes.status, 200, 'Users list should return 200');
  const usersData = await usersRes.json();
  assert.ok(Array.isArray(usersData.data), 'usersData.data must be an array');
  assert.ok(usersData.data.length > 0, 'Should return at least one customer');
  const sample = usersData.data[0];
  assert.ok(sample.email, 'Customer email must be present');
  assert.ok(sample.name, 'Customer name must be present');
  assert.strictEqual(sample.password, undefined, 'Password must never be exposed');
  console.log(`✅ [3/7] Customers list verified: Count=${usersData.data.length}, Sample=${sample.name} (${sample.email})`);
  passCount++;

  // 4. Admin Customer Details by ID
  console.log('\n[4/7] Testing Customer Detail by ID (GET /api/v1/users/:id)...');
  const customerId = sample.id;
  const detailRes = await fetch(`${BASE_URL}/users/${customerId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(detailRes.status, 200, 'User detail should return 200');
  const detailData = await detailRes.json();
  assert.strictEqual(detailData.data.id, customerId, 'User ID must match');
  assert.ok(Array.isArray(detailData.data.addresses), 'Addresses array must exist');
  assert.ok(Array.isArray(detailData.data.orders), 'Orders array must exist');
  assert.strictEqual(detailData.data.password, undefined, 'Password must never be exposed');
  console.log(`✅ [4/7] Customer detail verified: ${detailData.data.name}, Phone: ${detailData.data.phone || 'N/A'}`);
  passCount++;

  // 5. Admin Deactivate and Reactivate Customer
  console.log('\n[5/7] Testing Customer Deactivation/Reactivation...');
  const deactRes = await fetch(`${BASE_URL}/users/${customerId}/deactivate`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(deactRes.status, 200, 'Deactivate should return 200');
  const deactData = await deactRes.json();
  assert.strictEqual(deactData.data.isActive, false, 'User isActive should be false');

  const actRes = await fetch(`${BASE_URL}/users/${customerId}/activate`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(actRes.status, 200, 'Activate should return 200');
  const actData = await actRes.json();
  assert.strictEqual(actData.data.isActive, true, 'User isActive should be restored to true');
  console.log('✅ [5/7] Customer account toggle verified.');
  passCount++;

  // 6. Security: Non-Admin Access Forbidden
  console.log('\n[6/7] Testing Security: Customer access to Dashboard must be forbidden...');
  const userRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@ecommerce.com', password: 'User123456' }),
  });
  const userData = await userRes.json();
  const userToken = userData.token;

  const forbiddenRes = await fetch(`${BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.strictEqual(forbiddenRes.status, 403, 'Regular user must receive 403 Forbidden');
  console.log('✅ [6/7] Security verified: Regular user blocked with 403 Forbidden.');
  passCount++;

  // 7. AI Chatbot Public Endpoint (English & Arabic)
  console.log('\n[7/7] Testing AI Chatbot Public Endpoint (POST /api/v1/chatbot/message)...');
  const chatEn = await fetch(`${BASE_URL}/chatbot/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What categories do you sell?' }),
  });
  assert.strictEqual(chatEn.status, 200, 'Chatbot English must return 200');
  const chatEnData = await chatEn.json();
  assert.ok(chatEnData.reply && chatEnData.reply.length > 0, 'Reply must not be empty');

  const chatAr = await fetch(`${BASE_URL}/chatbot/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'مرحبا' }),
  });
  assert.strictEqual(chatAr.status, 200, 'Chatbot Arabic must return 200');
  const chatArData = await chatAr.json();
  assert.ok(chatArData.reply.includes('أهلاً') || chatArData.reply.includes('مساعدك'), 'Arabic greeting expected');
  console.log('✅ [7/7] AI Chatbot verified for English and Arabic queries.');
  passCount++;

  console.log(`\n========================================`);
  console.log(`🎉 ALL ${passCount}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log(`========================================\n`);
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
