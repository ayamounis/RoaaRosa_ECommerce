import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function testContactMailbox() {
  console.log('📬 Starting Contact Us & Mailbox Automated Verification...');

  // 1. Submit public contact message
  console.log('\n[1/4] Submitting Contact Us message (POST /api/v1/contact)...');
  const postRes = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Nouran Mostafa',
      email: 'nouran.test@example.com',
      phone: '+201122334455',
      subject: 'Inquiry about Spring Floral Dress Collection',
      message: 'Hello, will the dusty rose lace dress be available in size 8-10 next week? Thank you!',
    }),
  });

  const postData = await postRes.json();
  assert.strictEqual(postRes.status, 201);
  assert.ok(postData.id || postData._id);
  assert.strictEqual(postData.status, 'UNREAD');
  const messageId = postData.id || postData._id;
  console.log('✅ [1/4] Message submitted successfully. ID:', messageId);

  // 2. Authenticate as Admin
  console.log('\n[2/4] Authenticating as Admin...');
  const loginRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@ecommerce.com',
      password: 'Admin123456',
    }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  assert.ok(token);
  console.log('✅ [2/4] Admin authenticated.');

  // 3. List Mailbox Messages as Admin
  console.log('\n[3/4] Listing Mailbox messages as Admin (GET /api/v1/contact)...');
  const listRes = await fetch(`${BASE_URL}/contact?status=UNREAD`, {
    headers: {
      Authorization: `Bearer ${token}`,
      token,
    },
  });
  const listData = await listRes.json();
  assert.strictEqual(listRes.status, 200);
  assert.ok(listData.total >= 1);
  assert.ok(listData.unreadCount >= 1);
  console.log(`✅ [3/4] Mailbox list verified. Total: ${listData.total}, Unread: ${listData.unreadCount}`);

  // 4. Mark Message as Read & Delete
  console.log('\n[4/4] Marking message as Read and Deleting...');
  const readRes = await fetch(`${BASE_URL}/contact/${messageId}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, token },
  });
  const readData = await readRes.json();
  assert.strictEqual(readRes.status, 200);
  assert.strictEqual(readData.status, 'READ');
  console.log('✅ Message marked as READ.');

  const delRes = await fetch(`${BASE_URL}/contact/${messageId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, token },
  });
  assert.strictEqual(delRes.status, 200);
  console.log('✅ Message deleted successfully.');

  console.log('\n🎉 ALL 4/4 CONTACT & MAILBOX TESTS PASSED SUCCESSFULLY!');
}

testContactMailbox().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
