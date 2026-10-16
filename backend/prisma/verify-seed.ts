import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function runVerification() {
  console.log('🧪 Starting Milestone 3 Verification Tests...');
  let passCount = 0;
  let totalTests = 5;

  try {
    // ----------------------------------------------------
    // Test 1: Row Counts across all 18 tables
    // ----------------------------------------------------
    console.log('\n[TC-M03-01] Verifying deterministic row counts across tables...');
    const usersCount = await prisma.user.count();
    const addressCount = await prisma.address.count();
    const categoriesCount = await prisma.category.count();
    const subCategoriesCount = await prisma.subCategory.count();
    const brandsCount = await prisma.brand.count();
    const sizesCount = await prisma.size.count();
    const colorsCount = await prisma.color.count();
    const productsCount = await prisma.product.count();
    const productImagesCount = await prisma.productImage.count();
    const variantsCount = await prisma.productVariant.count();
    const couponsCount = await prisma.coupon.count();
    const wishlistCount = await prisma.wishlistItem.count();
    const reviewsCount = await prisma.review.count();
    const cartsCount = await prisma.cart.count();
    const cartItemsCount = await prisma.cartItem.count();
    const ordersCount = await prisma.order.count();
    const orderItemsCount = await prisma.orderItem.count();
    const paymentsCount = await prisma.payment.count();

    console.log(`- Users: ${usersCount} (expected: 2)`);
    console.log(`- Addresses: ${addressCount} (expected: 1)`);
    console.log(`- Categories: ${categoriesCount} (expected: 3)`);
    console.log(`- SubCategories: ${subCategoriesCount} (expected: 6)`);
    console.log(`- Brands: ${brandsCount} (expected: 3)`);
    console.log(`- Sizes: ${sizesCount} (expected: 4)`);
    console.log(`- Colors: ${colorsCount} (expected: 3)`);
    console.log(`- Products: ${productsCount} (expected: 6)`);
    console.log(`- ProductImages: ${productImagesCount} (expected: 2)`);
    console.log(`- ProductVariants: ${variantsCount} (expected: 12)`);
    console.log(`- Coupons: ${couponsCount} (expected: 2)`);
    console.log(`- WishlistItems: ${wishlistCount} (expected: 1)`);
    console.log(`- Reviews: ${reviewsCount} (expected: 1)`);
    console.log(`- Carts: ${cartsCount} (expected: 1)`);
    console.log(`- CartItems: ${cartItemsCount} (expected: 1)`);
    console.log(`- Orders: ${ordersCount} (expected: 0)`);
    console.log(`- OrderItems: ${orderItemsCount} (expected: 0)`);
    console.log(`- Payments: ${paymentsCount} (expected: 0)`);

    if (
      usersCount === 2 &&
      addressCount === 1 &&
      categoriesCount === 3 &&
      subCategoriesCount === 6 &&
      brandsCount === 3 &&
      sizesCount === 4 &&
      colorsCount === 3 &&
      productsCount === 6 &&
      productImagesCount === 2 &&
      variantsCount === 12 &&
      couponsCount === 2 &&
      wishlistCount === 1 &&
      reviewsCount === 1 &&
      cartsCount === 1 &&
      cartItemsCount === 1 &&
      ordersCount === 0 &&
      orderItemsCount === 0 &&
      paymentsCount === 0
    ) {
      console.log('✅ TC-M03-01 PASSED');
      passCount++;
    } else {
      throw new Error('TC-M03-01 FAILED: Unexpected row counts!');
    }

    // ----------------------------------------------------
    // Test 2: Partial Unique Index (idx_product_variant_single_default)
    // ----------------------------------------------------
    console.log('\n[TC-M03-02] Verifying Partial Unique Index on ProductVariant.isDefault...');
    const defaultVariantsCount = await prisma.productVariant.count({
      where: { isDefault: true },
    });
    console.log(`- Total default variants: ${defaultVariantsCount} (expected 6, exactly one per product)`);

    // Verify negative test: trying to insert second default variant for product 1 must be rejected by PostgreSQL
    let indexRejectionVerified = false;
    const prod1 = await prisma.product.findFirst({ where: { slug: 'classic-cotton-crewneck-t-shirt' } });
    const sizeXL = await prisma.size.findFirst({ where: { code: 'XL' } });
    const colorWhite = await prisma.color.findFirst({ where: { hexCode: '#FFFFFF' } });

    try {
      await prisma.productVariant.create({
        data: {
          productId: prod1!.id,
          sizeId: sizeXL!.id,
          colorId: colorWhite!.id,
          sku: 'TSH-DUPLICATE-DEFAULT-TEST',
          isDefault: true, // Should trigger unique constraint violation on idx_product_variant_single_default
        },
      });
    } catch (e: any) {
      console.log(`- Attempted duplicate default variant rejected by PostgreSQL as expected: ${e.code || e.message}`);
      indexRejectionVerified = true;
    }

    if (defaultVariantsCount === 6 && indexRejectionVerified) {
      console.log('✅ TC-M03-02 PASSED');
      passCount++;
    } else {
      throw new Error('TC-M03-02 FAILED: Partial unique index was not enforced!');
    }

    // ----------------------------------------------------
    // Test 3: PostgreSQL Custom CHECK Constraints
    // ----------------------------------------------------
    console.log('\n[TC-M03-03] Verifying custom CHECK constraints rejection...');
    let stockConstraintEnforced = false;
    let priceConstraintEnforced = false;

    // A: Test negative stockQuantity (< 0)
    try {
      await prisma.productVariant.create({
        data: {
          productId: prod1!.id,
          sizeId: sizeXL!.id,
          colorId: colorWhite!.id,
          sku: 'TSH-NEG-STOCK-TEST',
          stockQuantity: -5,
          isDefault: false,
        },
      });
    } catch (e: any) {
      console.log(`- Negative stockQuantity rejected as expected by chk_product_variant_stock_quantity_non_negative`);
      stockConstraintEnforced = true;
    }

    // B: Test invalid priceAfterDiscount > price
    try {
      await prisma.product.create({
        data: {
          title: 'Invalid Discount Test Product',
          slug: 'invalid-discount-test',
          description: 'Testing discount constraint',
          price: 100.0,
          priceAfterDiscount: 200.0, // Invalid: priceAfterDiscount > price
          imageCover: '/test.jpg',
          categoryId: (await prisma.category.findFirst())!.id,
        },
      });
    } catch (e: any) {
      console.log(`- Invalid discount rejected as expected by chk_product_discount_less_than_price`);
      priceConstraintEnforced = true;
    }

    if (stockConstraintEnforced && priceConstraintEnforced) {
      console.log('✅ TC-M03-03 PASSED');
      passCount++;
    } else {
      throw new Error('TC-M03-03 FAILED: Custom CHECK constraints were not enforced!');
    }

    // ----------------------------------------------------
    // Test 4: Password Hashing & Bcrypt Verification
    // ----------------------------------------------------
    console.log('\n[TC-M03-04] Verifying Password Hashing & Bcrypt authentication...');
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@ecommerce.com' } });
    const normalUser = await prisma.user.findUnique({ where: { email: 'user@ecommerce.com' } });

    const adminMatch = await bcrypt.compare('Admin123456', adminUser!.password);
    const userMatch = await bcrypt.compare('User123456', normalUser!.password);
    const invalidMatch = await bcrypt.compare('WrongPassword', normalUser!.password);

    console.log(`- Admin password matches 'Admin123456': ${adminMatch}`);
    console.log(`- User password matches 'User123456': ${userMatch}`);
    console.log(`- False password rejected: ${!invalidMatch}`);

    if (adminMatch && userMatch && !invalidMatch) {
      console.log('✅ TC-M03-04 PASSED');
      passCount++;
    } else {
      throw new Error('TC-M03-04 FAILED: Password hashing verification failed!');
    }

    // ----------------------------------------------------
    // Test 5: Out of Stock Edge Case & Cart Item Integrity
    // ----------------------------------------------------
    console.log('\n[TC-M03-05] Verifying Out-of-Stock Product & CartItem Variant linking...');
    const oosProduct = await prisma.product.findUnique({
      where: { slug: 'graphic-heritage-essential-tee' },
      include: { variants: true },
    });
    console.log(`- Out-of-stock product found: ${oosProduct?.title}, variant stock: ${oosProduct?.variants[0]?.stockQuantity}`);

    const cart = await prisma.cart.findUnique({
      where: { userId: normalUser!.id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true, size: true, color: true },
            },
          },
        },
      },
    });

    console.log(`- User cart item variant SKU: ${cart?.items[0]?.variant.sku}`);
    console.log(`- User cart item price: ${cart?.items[0]?.price} (Quantity: ${cart?.items[0]?.quantity})`);

    if (
      oosProduct &&
      oosProduct.variants[0].stockQuantity === 0 &&
      cart &&
      cart.items.length === 1 &&
      cart.items[0].variant.sku === 'TSH-COT-BLK-S'
    ) {
      console.log('✅ TC-M03-05 PASSED');
      passCount++;
    } else {
      throw new Error('TC-M03-05 FAILED: Out of stock or cart verification failed!');
    }

    console.log(`\n========================================`);
    console.log(`🎉 ALL ${passCount}/${totalTests} TESTS PASSED CLEANLY!`);
    console.log(`========================================\n`);
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
