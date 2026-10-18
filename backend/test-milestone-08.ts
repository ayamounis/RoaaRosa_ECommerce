import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const baseUrl = 'http://localhost:5000/api/v1';

async function runMilestone8Tests() {
  console.log('🧪 Starting Milestone 8 (Catalog & Product Variants) Verification Tests...\n');
  let passCount = 0;
  const totalTests = 7;

  try {
    // ----------------------------------------------------
    // TC-M08-01: Get All Products with Pagination & Relations
    // ----------------------------------------------------
    console.log('[TC-M08-01] Testing GET /api/v1/products (pagination & relations)...');
    const allProdRes = await fetch(`${baseUrl}/products?page=1&limit=10`);
    const allProdJson = await allProdRes.json();
    console.log('Products Status:', allProdRes.status);
    console.log('Products Count:', allProdJson.data?.length);

    if (
      allProdRes.status === 200 &&
      Array.isArray(allProdJson.data) &&
      allProdJson.data.length >= 6 &&
      allProdJson.data[0].id &&
      allProdJson.data[0]._id &&
      typeof allProdJson.data[0].price === 'number' &&
      Array.isArray(allProdJson.data[0].images) &&
      allProdJson.data[0].category &&
      allProdJson.data[0].variants
    ) {
      console.log('✅ TC-M08-01 PASSED: Products returned with full relations and dual IDs.\n');
      passCount++;
    } else {
      throw new Error(`Get all products failed: ${JSON.stringify(allProdJson)}`);
    }

    const firstProduct = allProdJson.data[0];
    const menCatId = firstProduct.categoryId;

    // ----------------------------------------------------
    // TC-M08-02: Category Filter (category[in]=<id>)
    // ----------------------------------------------------
    console.log('[TC-M08-02] Testing GET /api/v1/products?category[in]=<id> ...');
    const catFilteredRes = await fetch(`${baseUrl}/products?category[in]=${menCatId}`);
    const catFilteredJson = await catFilteredRes.json();

    const allMatchCategory = catFilteredJson.data?.every((p: any) => p.categoryId === menCatId);
    if (
      catFilteredRes.status === 200 &&
      catFilteredJson.data?.length > 0 &&
      allMatchCategory
    ) {
      console.log(`✅ TC-M08-02 PASSED: Category filter returned only products for category ${menCatId}.\n`);
      passCount++;
    } else {
      throw new Error(`Category filter failed: ${JSON.stringify(catFilteredJson)}`);
    }

    // ----------------------------------------------------
    // TC-M08-03: Price Range & Sorting (price[gte], price[lte], sort=-price)
    // ----------------------------------------------------
    console.log('[TC-M08-03] Testing Price Range and Descending Sort...');
    const priceRes = await fetch(`${baseUrl}/products?price[gte]=400&price[lte]=900&sort=-price`);
    const priceJson = await priceRes.json();

    const inRange = priceJson.data?.every((p: any) => p.price >= 400 && p.price <= 900);
    let isSortedDesc = true;
    for (let i = 0; i < (priceJson.data?.length || 0) - 1; i++) {
      if (priceJson.data[i].price < priceJson.data[i + 1].price) {
        isSortedDesc = false;
        break;
      }
    }

    if (priceRes.status === 200 && priceJson.data?.length > 0 && inRange && isSortedDesc) {
      console.log('✅ TC-M08-03 PASSED: Price range and descending sorting verified.\n');
      passCount++;
    } else {
      throw new Error(`Price filter or sorting failed: ${JSON.stringify(priceJson)}`);
    }

    // ----------------------------------------------------
    // TC-M08-04: Single Product Details (GET /products/:id)
    // ----------------------------------------------------
    console.log('[TC-M08-04] Testing GET /api/v1/products/:id ...');
    const singleProdRes = await fetch(`${baseUrl}/products/${firstProduct.id}`);
    const singleProdJson = await singleProdRes.json();

    if (
      singleProdRes.status === 200 &&
      singleProdJson.data?.id === firstProduct.id &&
      singleProdJson.data?._id === firstProduct.id &&
      singleProdJson.data?.variants?.length > 0 &&
      singleProdJson.data?.variants[0].size &&
      singleProdJson.data?.variants[0].color
    ) {
      console.log('✅ TC-M08-04 PASSED: Single product details contain full variant dimensions.\n');
      passCount++;
    } else {
      throw new Error(`Get single product failed: ${JSON.stringify(singleProdJson)}`);
    }

    // ----------------------------------------------------
    // TC-M08-05: Product Variants Endpoint (GET /products/:id/variants)
    // ----------------------------------------------------
    console.log('[TC-M08-05] Testing GET /api/v1/products/:id/variants ...');
    const variantsRes = await fetch(`${baseUrl}/products/${firstProduct.id}/variants`);
    const variantsJson = await variantsRes.json();

    if (
      variantsRes.status === 200 &&
      Array.isArray(variantsJson.data) &&
      variantsJson.data.length > 0 &&
      variantsJson.data.some((v: any) => v.isDefault === true)
    ) {
      console.log(`✅ TC-M08-05 PASSED: Variants endpoint returned ${variantsJson.data.length} variants.\n`);
      passCount++;
    } else {
      throw new Error(`Variants endpoint failed: ${JSON.stringify(variantsJson)}`);
    }

    // ----------------------------------------------------
    // TC-M08-06: Out of Stock Edge Case Product
    // ----------------------------------------------------
    console.log('[TC-M08-06] Testing Out-of-Stock Product edge case...');
    const oosRes = await fetch(`${baseUrl}/products?keyword=Graphic`);
    const oosJson = await oosRes.json();
    const oosProduct = oosJson.data?.find((p: any) => p.slug === 'graphic-heritage-essential-tee');

    if (oosProduct && oosProduct.quantity === 0) {
      console.log('✅ TC-M08-06 PASSED: Out-of-stock product correctly calculated quantity = 0.\n');
      passCount++;
    } else {
      throw new Error(`Out of stock check failed: ${JSON.stringify(oosJson)}`);
    }

    // ----------------------------------------------------
    // TC-M08-07: Admin Product & Variant Creation
    // ----------------------------------------------------
    console.log('[TC-M08-07] Testing Admin Product & Variant Creation...');
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

    // Fetch distinct sizes and colors from DB
    const allSizes = await prisma.size.findMany();
    const allColors = await prisma.color.findMany();
    const primarySizeId = allSizes[0].id;
    const secondarySizeId = allSizes[1].id;
    const colorId = allColors[0].id;

    // Create new product with primarySizeId
    const createProdRes = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: adminToken,
      },
      body: JSON.stringify({
        title: `Test Jacket ${Date.now()}`,
        description: 'Waterproof breathable winter jacket with fleece lining.',
        price: 1500,
        priceAfterDiscount: 1250,
        imageCover: '/uploads/products/jacket-front.jpg',
        images: ['/uploads/products/jacket-front.jpg', '/uploads/products/jacket-back.jpg'],
        categoryId: firstProduct.categoryId,
        sizeId: primarySizeId,
        colorId,
        stockQuantity: 15,
      }),
    });
    const createProdJson = await createProdRes.json();
    console.log('Create Product Status:', createProdRes.status);

    if (
      createProdRes.status === 201 &&
      createProdJson.data?.id &&
      createProdJson.data?.variants?.length === 1 &&
      createProdJson.data?.variants[0].stockQuantity === 15
    ) {
      console.log('Subtest A: Admin created product with initial variant.');
    } else {
      throw new Error(`Create product failed: ${JSON.stringify(createProdJson)}`);
    }

    const createdProductId = createProdJson.data.id;

    // Add secondary variant with distinct size (secondarySizeId)
    const addVariantRes = await fetch(`${baseUrl}/products/${createdProductId}/variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: adminToken,
      },
      body: JSON.stringify({
        sizeId: secondarySizeId,
        colorId,
        priceAdjustment: 50,
        stockQuantity: 20,
        isDefault: false,
      }),
    });
    const addVariantJson = await addVariantRes.json();

    if (addVariantRes.status === 201 && addVariantJson.data?.id) {
      console.log('Subtest B: Added secondary variant to new product.');
    } else {
      throw new Error(`Add variant failed: ${JSON.stringify(addVariantJson)}`);
    }

    console.log('✅ TC-M08-07 PASSED\n');
    passCount++;

    console.log('========================================');
    console.log(`🎉 ALL ${passCount}/${totalTests} TESTS PASSED CLEANLY!`);
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Milestone 8 test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMilestone8Tests();
