import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('🧪 Starting Milestone 9: Cart Management & Variant Compatibility Tests...\n');

  // 1. Authenticate regular user
  console.log('Step 1: Authenticating user...');
  const loginRes = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@ecommerce.com',
      password: 'User123456',
    }),
  });
  const loginData = await loginRes.json();
  assert.strictEqual(loginRes.status, 200, 'User login should succeed');
  const token = loginData.token;
  assert.ok(token, 'JWT token should be present');
  console.log('✅ User authenticated successfully.');

  // 2. Clear cart before starting to ensure clean state
  console.log('\nStep 2: Clearing cart for clean state...');
  const clearRes = await fetch(`${BASE_URL}/cart`, {
    method: 'DELETE',
    headers: { token },
  });
  const clearData = await clearRes.json();
  assert.strictEqual(clearRes.status, 200, 'Clear cart should return 200');
  assert.strictEqual(clearData.message, 'success', 'Clear cart response message should be "success"');
  console.log('✅ Cart cleared successfully.');

  // 3. Test GET empty cart
  console.log('\nStep 3: Testing GET empty cart...');
  const emptyCartRes = await fetch(`${BASE_URL}/cart`, {
    headers: { token },
  });
  const emptyCartData = await emptyCartRes.json();
  assert.strictEqual(emptyCartRes.status, 200, 'GET /cart should return 200');
  assert.strictEqual(emptyCartData.status, 'success', 'Status should be "success"');
  assert.strictEqual(emptyCartData.numOfCartItems, 0, 'numOfCartItems should be 0');
  assert.strictEqual(emptyCartData.data.products.length, 0, 'Products array should be empty');
  assert.strictEqual(emptyCartData.data.totalCartPrice, 0, 'totalCartPrice should be 0');
  console.log('✅ Empty cart response shape verified.');

  // 4. Fetch available products
  console.log('\nStep 4: Fetching products for cart testing...');
  const prodRes = await fetch(`${BASE_URL}/products?limit=5`);
  const prodData = await prodRes.json();
  assert.ok(prodData.data && prodData.data.length >= 2, 'Should have at least 2 products seeded');
  const productA = prodData.data[0];
  const productB = prodData.data[1];
  console.log(`Product A: ${productA.title} (ID: ${productA.id})`);
  console.log(`Product B: ${productB.title} (ID: ${productB.id})`);

  // 5. Add to Cart via productId (Frontend Mode: auto VariantResolver)
  console.log('\nStep 5: Testing POST /cart with productId (Option D VariantResolver)...');
  const addByProdRes = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token,
    },
    body: JSON.stringify({
      productId: productA.id,
    }),
  });
  const addByProdData = await addByProdRes.json();
  assert.strictEqual(addByProdRes.status, 201, 'POST /cart should return 201');
  assert.strictEqual(addByProdData.status, 'success');
  assert.strictEqual(addByProdData.message, 'Product added successfully to your cart');
  assert.strictEqual(addByProdData.numOfCartItems, 1);
  assert.ok(addByProdData.cartId, 'cartId should be present at top level');
  assert.strictEqual(addByProdData.data.products.length, 1);
  assert.strictEqual(addByProdData.data.products[0].count, 1);
  assert.strictEqual(addByProdData.data.products[0].product.id, productA.id);
  assert.ok(addByProdData.data.products[0].product.imageCover);
  assert.ok(addByProdData.data.totalCartPrice > 0);
  console.log(`✅ Added product A via productId. Cart total: ${addByProdData.data.totalCartPrice} EGP`);

  // 6. Add specific variant via variantId
  console.log('\nStep 6: Testing POST /cart with specific variantId...');
  const variantsRes = await fetch(`${BASE_URL}/products/${productB.id}/variants`);
  const variantsData = await variantsRes.json();
  assert.ok(variantsData.data && variantsData.data.length > 0, 'Product B should have variants');
  const variantB = variantsData.data[0];

  const addByVarRes = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token,
    },
    body: JSON.stringify({
      variantId: variantB.id,
      quantity: 2,
    }),
  });
  const addByVarData = await addByVarRes.json();
  assert.strictEqual(addByVarRes.status, 201);
  assert.strictEqual(addByVarData.numOfCartItems, 2);
  assert.strictEqual(addByVarData.data.products.length, 2);
  console.log('✅ Added product B variant with quantity 2. Cart items count: 2');

  // 7. Update quantity via productId (dual ID resolution)
  console.log('\nStep 7: Testing PUT /cart/:id using productId...');
  const updateRes = await fetch(`${BASE_URL}/cart/${productA.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token,
    },
    body: JSON.stringify({
      count: 4,
    }),
  });
  const updateData = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  const updatedItemA = updateData.data.products.find((p: any) => p.product.id === productA.id);
  assert.ok(updatedItemA, 'Item A should be present in cart');
  assert.strictEqual(updatedItemA.count, 4, 'Count should be updated to 4');
  console.log('✅ Updated product A count to 4 via productId.');

  // 8. Test Stock Limit Validation
  console.log('\nStep 8: Testing stock validation error handling...');
  const excessiveRes = await fetch(`${BASE_URL}/cart/${productA.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token,
    },
    body: JSON.stringify({
      count: 999999,
    }),
  });
  const excessiveData = await excessiveRes.json();
  assert.strictEqual(excessiveRes.status, 400, 'Excessive quantity should be rejected with 400');
  assert.strictEqual(excessiveData.statusMsg, 'fail');
  console.log('✅ Stock over-limit properly rejected with 400.');

  // 9. Remove item via CartItem.id or productId
  console.log('\nStep 9: Testing DELETE /cart/:id...');
  const removeRes = await fetch(`${BASE_URL}/cart/${productA.id}`, {
    method: 'DELETE',
    headers: { token },
  });
  const removeData = await removeRes.json();
  assert.strictEqual(removeRes.status, 200);
  assert.strictEqual(removeData.numOfCartItems, 1);
  assert.strictEqual(removeData.data.products.length, 1);
  assert.strictEqual(removeData.data.products[0].variant.id, variantB.id);
  console.log('✅ Item removed successfully. Exactly 1 item remains in cart.');

  // 10. Clear cart completely
  console.log('\nStep 10: Testing DELETE /cart (Clear Cart)...');
  const finalClearRes = await fetch(`${BASE_URL}/cart`, {
    method: 'DELETE',
    headers: { token },
  });
  const finalClearData = await finalClearRes.json();
  assert.strictEqual(finalClearRes.status, 200);
  assert.strictEqual(finalClearData.message, 'success');

  const finalCheckRes = await fetch(`${BASE_URL}/cart`, {
    headers: { token },
  });
  const finalCheckData = await finalCheckRes.json();
  assert.strictEqual(finalCheckData.numOfCartItems, 0);
  assert.strictEqual(finalCheckData.data.products.length, 0);
  assert.strictEqual(finalCheckData.data.totalCartPrice, 0);
  console.log('✅ Cart successfully cleared and confirmed empty.');

  console.log('\n🎉 ALL 10 TEST CASES IN MILESTONE 9 PASSED WITH 100% SUCCESS!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
