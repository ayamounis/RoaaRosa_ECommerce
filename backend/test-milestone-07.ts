const baseUrl = 'http://localhost:5000/api/v1';

async function runMilestone7Tests() {
  console.log('🧪 Starting Milestone 7 (Categories, Subcategories & Brands) Tests...\n');
  let passCount = 0;
  const totalTests = 6;

  try {
    // ----------------------------------------------------
    // TC-M07-01: Get All Categories (GET /categories)
    // ----------------------------------------------------
    console.log('[TC-M07-01] Testing GET /api/v1/categories...');
    const catRes = await fetch(`${baseUrl}/categories`);
    const catJson = await catRes.json();
    console.log('Categories Status:', catRes.status);
    console.log('Categories Count:', catJson.results || catJson.data?.length);

    if (
      catRes.status === 200 &&
      Array.isArray(catJson.data) &&
      catJson.data.length >= 3 &&
      catJson.data[0].id &&
      catJson.data[0]._id
    ) {
      console.log('✅ TC-M07-01 PASSED: Categories retrieved with dual ID format.\n');
      passCount++;
    } else {
      throw new Error(`Get all categories failed: ${JSON.stringify(catJson)}`);
    }

    const firstCategory = catJson.data[0];

    // ----------------------------------------------------
    // TC-M07-02: Get Specific Category (GET /categories/:id)
    // ----------------------------------------------------
    console.log('[TC-M07-02] Testing GET /api/v1/categories/:id...');
    const singleCatRes = await fetch(`${baseUrl}/categories/${firstCategory.id}`);
    const singleCatJson = await singleCatRes.json();

    if (
      singleCatRes.status === 200 &&
      singleCatJson.data?.id === firstCategory.id &&
      singleCatJson.data?._id === firstCategory.id &&
      singleCatJson.data?.name === firstCategory.name
    ) {
      console.log(`✅ TC-M07-02 PASSED: Category '${firstCategory.name}' retrieved.\n`);
      passCount++;
    } else {
      throw new Error(`Get single category failed: ${JSON.stringify(singleCatJson)}`);
    }

    // ----------------------------------------------------
    // TC-M07-03: Subcategories on Category (GET /categories/:id/subcategories)
    // ----------------------------------------------------
    console.log('[TC-M07-03] Testing GET /api/v1/categories/:id/subcategories...');
    const catSubRes = await fetch(`${baseUrl}/categories/${firstCategory.id}/subcategories`);
    const catSubJson = await catSubRes.json();

    if (
      catSubRes.status === 200 &&
      Array.isArray(catSubJson.data) &&
      catSubJson.data.length > 0 &&
      catSubJson.data[0].category === firstCategory.id // matches category string ID
    ) {
      console.log(`✅ TC-M07-03 PASSED: Subcategories linked to category retrieved.\n`);
      passCount++;
    } else {
      throw new Error(`Subcategories on category failed: ${JSON.stringify(catSubJson)}`);
    }

    // ----------------------------------------------------
    // TC-M07-04: All Subcategories & Specific Subcategory
    // ----------------------------------------------------
    console.log('[TC-M07-04] Testing GET /api/v1/subcategories...');
    const allSubRes = await fetch(`${baseUrl}/subcategories`);
    const allSubJson = await allSubRes.json();

    if (
      allSubRes.status === 200 &&
      Array.isArray(allSubJson.data) &&
      allSubJson.data.length >= 6
    ) {
      console.log(`Subtest A: All subcategories retrieved (${allSubJson.data.length} items).`);
    } else {
      throw new Error(`Get all subcategories failed: ${JSON.stringify(allSubJson)}`);
    }

    const firstSub = allSubJson.data[0];
    const singleSubRes = await fetch(`${baseUrl}/subcategories/${firstSub.id}`);
    const singleSubJson = await singleSubRes.json();

    if (
      singleSubRes.status === 200 &&
      singleSubJson.data?.id === firstSub.id &&
      singleSubJson.data?.category === firstSub.category
    ) {
      console.log('Subtest B: Specific subcategory retrieved with category field.');
    } else {
      throw new Error(`Get single subcategory failed: ${JSON.stringify(singleSubJson)}`);
    }

    console.log('✅ TC-M07-04 PASSED\n');
    passCount++;

    // ----------------------------------------------------
    // TC-M07-05: Brands (GET /brands and GET /brands/:id)
    // ----------------------------------------------------
    console.log('[TC-M07-05] Testing GET /api/v1/brands & GET /brands/:id...');
    const allBrandsRes = await fetch(`${baseUrl}/brands`);
    const allBrandsJson = await allBrandsRes.json();

    if (
      allBrandsRes.status === 200 &&
      Array.isArray(allBrandsJson.data) &&
      allBrandsJson.data.length >= 3
    ) {
      console.log(`Subtest A: Brands retrieved (${allBrandsJson.data.length} brands).`);
    } else {
      throw new Error(`Get all brands failed: ${JSON.stringify(allBrandsJson)}`);
    }

    const firstBrand = allBrandsJson.data[0];
    const singleBrandRes = await fetch(`${baseUrl}/brands/${firstBrand.id}`);
    const singleBrandJson = await singleBrandRes.json();

    if (singleBrandRes.status === 200 && singleBrandJson.data?.name === firstBrand.name) {
      console.log(`Subtest B: Brand '${firstBrand.name}' retrieved.`);
    } else {
      throw new Error(`Get single brand failed: ${JSON.stringify(singleBrandJson)}`);
    }

    console.log('✅ TC-M07-05 PASSED\n');
    passCount++;

    // ----------------------------------------------------
    // TC-M07-06: Admin CRUD & ON DELETE RESTRICT Protection
    // ----------------------------------------------------
    console.log('[TC-M07-06] Testing Admin CRUD & ON DELETE RESTRICT Protection...');
    // Log in as Admin
    const adminLoginRes = await fetch(`${baseUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ecommerce.com',
        password: 'Admin123456',
      }),
    });
    const adminLoginJson = await adminLoginRes.json();
    const adminToken = adminLoginJson.token;

    // A: Create new Category
    const createCatRes = await fetch(`${baseUrl}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: adminToken,
      },
      body: JSON.stringify({
        name: `Fitness & Training ${Date.now()}`,
        image: '/uploads/categories/fitness.png',
      }),
    });
    const createCatJson = await createCatRes.json();
    const newCatId = createCatJson.data.id;
    console.log('Subtest A: Admin created new category:', newCatId);

    // B: Attempt to delete a seeded Category referenced by products (RESTRICT check)
    const deleteReferencedRes = await fetch(`${baseUrl}/categories/${firstCategory.id}`, {
      method: 'DELETE',
      headers: { token: adminToken },
    });
    const deleteReferencedJson = await deleteReferencedRes.json();
    if (
      deleteReferencedRes.status === 400 &&
      deleteReferencedJson.message.includes('ON DELETE RESTRICT')
    ) {
      console.log('Subtest B: RESTRICT constraint blocked deletion of category referenced by products.');
    } else {
      throw new Error('RESTRICT deletion protection failed!');
    }

    // C: Delete newly created empty category
    const deleteEmptyRes = await fetch(`${baseUrl}/categories/${newCatId}`, {
      method: 'DELETE',
      headers: { token: adminToken },
    });
    if (deleteEmptyRes.status === 200) {
      console.log('Subtest C: Empty category deleted cleanly.');
    } else {
      throw new Error('Delete empty category failed!');
    }

    console.log('✅ TC-M07-06 PASSED\n');
    passCount++;

    console.log('========================================');
    console.log(`🎉 ALL ${passCount}/${totalTests} TESTS PASSED CLEANLY!`);
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Milestone 7 test failed:', error);
    process.exit(1);
  }
}

runMilestone7Tests();
