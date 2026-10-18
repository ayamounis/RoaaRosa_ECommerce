import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('🧪 Starting Milestone 10: Wishlist & Reviews Tests...\n');

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

  // 2. Fetch a product to test on
  console.log('\nStep 2: Fetching product for testing...');
  const prodRes = await fetch(`${BASE_URL}/products?limit=1`);
  const prodData = await prodRes.json();
  assert.ok(prodData.data && prodData.data.length > 0);
  const product = prodData.data[0];
  console.log(`Using product: ${product.title} (ID: ${product.id})`);

  // 3. Wishlist: Add product
  console.log('\nStep 3: Testing POST /wishlist (Add to wishlist)...');
  const addWishRes = await fetch(`${BASE_URL}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify({ productId: product.id }),
  });
  const addWishData = await addWishRes.json();
  assert.strictEqual(addWishRes.status, 201);
  assert.strictEqual(addWishData.status, 'success');
  assert.ok(Array.isArray(addWishData.data));
  assert.ok(addWishData.data.includes(product.id));
  console.log('✅ Product added to wishlist.');

  // 4. Wishlist: Get user wishlist
  console.log('\nStep 4: Testing GET /wishlist...');
  const getWishRes = await fetch(`${BASE_URL}/wishlist`, {
    headers: { token: userToken },
  });
  const getWishData = await getWishRes.json();
  assert.strictEqual(getWishRes.status, 200);
  assert.strictEqual(getWishData.status, 'success');
  assert.ok(getWishData.count >= 1);
  const foundItem = getWishData.data.find((p: any) => p.id === product.id);
  assert.ok(foundItem, 'Product must be in wishlist items');
  assert.ok(foundItem.imageCover, 'Must include imageCover');
  assert.ok(foundItem.category, 'Must include category object');
  console.log('✅ Wishlist fetched with rich product data.');

  // 5. Wishlist: Remove product
  console.log('\nStep 5: Testing DELETE /wishlist/:id...');
  const removeWishRes = await fetch(`${BASE_URL}/wishlist/${product.id}`, {
    method: 'DELETE',
    headers: { token: userToken },
  });
  const removeWishData = await removeWishRes.json();
  assert.strictEqual(removeWishRes.status, 200);
  assert.strictEqual(removeWishData.status, 'success');
  assert.ok(!removeWishData.data.includes(product.id));
  console.log('✅ Product removed from wishlist.');

  // Clean any old reviews for this user & product if existing
  const checkOldReviews = await fetch(`${BASE_URL}/reviews?productId=${product.id}`);
  const oldReviewsData = await checkOldReviews.json();
  if (oldReviewsData.data && oldReviewsData.data.length > 0) {
    for (const r of oldReviewsData.data) {
      if (r.user.id === userData.data.id) {
        await fetch(`${BASE_URL}/reviews/${r.id}`, {
          method: 'DELETE',
          headers: { token: userToken },
        });
      }
    }
  }

  // 6. Reviews: Create a review
  console.log('\nStep 6: Testing POST /reviews (Create review)...');
  const createRevRes = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify({
      productId: product.id,
      rating: 4,
      title: 'Great quality coat',
      comment: 'The material is exceptional and fits true to size.',
    }),
  });
  const createRevData = await createRevRes.json();
  assert.strictEqual(createRevRes.status, 201);
  assert.strictEqual(createRevData.status, 'success');
  const reviewId = createRevData.data.id;
  assert.ok(reviewId);
  console.log(`✅ Review created with ID: ${reviewId}`);

  // 7. Verify product rating recalculation
  console.log('\nStep 7: Verifying product ratingsAverage recalculated on product...');
  const updatedProdRes = await fetch(`${BASE_URL}/products/${product.id}`);
  const updatedProdData = await updatedProdRes.json();
  assert.strictEqual(updatedProdRes.status, 200);
  assert.ok(updatedProdData.data.ratingsQuantity >= 1);
  assert.ok(Number(updatedProdData.data.ratingsAverage) > 0);
  console.log(`✅ Product rating updated: avg=${updatedProdData.data.ratingsAverage}, count=${updatedProdData.data.ratingsQuantity}`);

  // 8. Reviews: Duplicate review rejection
  console.log('\nStep 8: Testing duplicate review rejection...');
  const dupRevRes = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify({
      productId: product.id,
      rating: 5,
    }),
  });
  const dupRevData = await dupRevRes.json();
  assert.strictEqual(dupRevRes.status, 400);
  assert.strictEqual(dupRevData.statusMsg, 'fail');
  console.log('✅ Duplicate review properly rejected with 400.');

  // 9. Reviews: Update review
  console.log('\nStep 9: Testing PUT /reviews/:id...');
  const updateRevRes = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify({
      rating: 5,
      comment: 'Updated to 5 stars! Even better after a few days.',
    }),
  });
  const updateRevData = await updateRevRes.json();
  assert.strictEqual(updateRevRes.status, 200);
  assert.strictEqual(updateRevData.data.rating, 5);
  console.log('✅ Review rating updated to 5.');

  // 10. Reviews: Delete review
  console.log('\nStep 10: Testing DELETE /reviews/:id...');
  const deleteRevRes = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { token: userToken },
  });
  const deleteRevData = await deleteRevRes.json();
  assert.strictEqual(deleteRevRes.status, 200);
  assert.strictEqual(deleteRevData.message, 'Review deleted successfully');
  console.log('✅ Review deleted successfully.');

  console.log('\n🎉 ALL 10 TEST CASES IN MILESTONE 10 PASSED WITH 100% SUCCESS!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
