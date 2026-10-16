import { PrismaClient, Role, DiscountType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting deterministic database seeding...');

  // 1. Clean existing records in reverse dependency order
  console.log('🧹 Cleaning existing data...');
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.size.deleteMany();
  await prisma.color.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users & Addresses
  console.log('👤 Seeding Users & Addresses...');
  const adminPasswordHash = await bcrypt.hash('Admin123456', 10);
  const userPasswordHash = await bcrypt.hash('User123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@ecommerce.com',
      password: adminPasswordHash,
      phone: '+201000000001',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Mohamed Fares',
      email: 'user@ecommerce.com',
      password: userPasswordHash,
      phone: '+201000000002',
      role: Role.USER,
      isActive: true,
      addresses: {
        create: {
          alias: 'Home',
          details: '15 El-Tahrir Street, Apt 4B',
          phone: '+201000000002',
          city: 'Cairo',
          postalCode: '11511',
          isDefault: true,
        },
      },
    },
  });

  // 3. Categories & Subcategories
  console.log('🏷️ Seeding Taxonomy (Categories, Subcategories, Brands)...');
  const catMen = await prisma.category.create({
    data: {
      name: "Men's Fashion",
      slug: 'men-fashion',
      image: '/uploads/categories/men.png',
      subCategories: {
        create: [
          { name: 'Men T-Shirts', slug: 'men-t-shirts' },
          { name: 'Men Pants', slug: 'men-pants' },
        ],
      },
    },
    include: { subCategories: true },
  });

  const catWomen = await prisma.category.create({
    data: {
      name: "Women's Fashion",
      slug: 'women-fashion',
      image: '/uploads/categories/women.png',
      subCategories: {
        create: [
          { name: 'Women Dresses', slug: 'women-dresses' },
          { name: 'Women Tops', slug: 'women-tops' },
        ],
      },
    },
    include: { subCategories: true },
  });

  const catKids = await prisma.category.create({
    data: {
      name: "Kids' Collection",
      slug: 'kids-collection',
      image: '/uploads/categories/kids.png',
      subCategories: {
        create: [
          { name: 'Boys Casual', slug: 'boys-casual' },
          { name: 'Girls Casual', slug: 'girls-casual' },
        ],
      },
    },
    include: { subCategories: true },
  });

  const subCatMenTshirts = catMen.subCategories.find((s) => s.slug === 'men-t-shirts')!;
  const subCatMenPants = catMen.subCategories.find((s) => s.slug === 'men-pants')!;
  const subCatWomenDresses = catWomen.subCategories.find((s) => s.slug === 'women-dresses')!;
  const subCatWomenTops = catWomen.subCategories.find((s) => s.slug === 'women-tops')!;
  const subCatKidsBoys = catKids.subCategories.find((s) => s.slug === 'boys-casual')!;

  // 4. Brands
  const brandZara = await prisma.brand.create({
    data: { name: 'Zara', slug: 'zara', image: '/uploads/brands/zara.png' },
  });
  const brandNike = await prisma.brand.create({
    data: { name: 'Nike', slug: 'nike', image: '/uploads/brands/nike.png' },
  });
  const brandAdidas = await prisma.brand.create({
    data: { name: 'Adidas', slug: 'adidas', image: '/uploads/brands/adidas.png' },
  });

  // 5. Sizes & Colors
  console.log('📏 Seeding Sizes & Colors...');
  const sizeS = await prisma.size.create({
    data: { name: 'Small', code: 'S', displayOrder: 1 },
  });
  const sizeM = await prisma.size.create({
    data: { name: 'Medium', code: 'M', displayOrder: 2 },
  });
  const sizeL = await prisma.size.create({
    data: { name: 'Large', code: 'L', displayOrder: 3 },
  });
  const sizeXL = await prisma.size.create({
    data: { name: 'X-Large', code: 'XL', displayOrder: 4 },
  });

  const colorNavy = await prisma.color.create({
    data: { name: 'Navy Blue', hexCode: '#000080' },
  });
  const colorBlack = await prisma.color.create({
    data: { name: 'Black', hexCode: '#000000' },
  });
  const colorWhite = await prisma.color.create({
    data: { name: 'White', hexCode: '#FFFFFF' },
  });

  // 6. Products & Variants
  console.log('👕 Seeding Products & Variants...');

  // Product 1: Classic Cotton Crewneck T-Shirt (Discounted)
  const product1 = await prisma.product.create({
    data: {
      title: 'Classic Cotton Crewneck T-Shirt',
      slug: 'classic-cotton-crewneck-t-shirt',
      description: 'Premium 100% Egyptian combed cotton crewneck t-shirt with ribbed collar and reinforced shoulder seams.',
      price: 450.00,
      priceAfterDiscount: 350.00,
      imageCover: '/uploads/products/crewneck-front.jpg',
      sold: 15,
      ratingsAverage: 4.5,
      ratingsQuantity: 1,
      categoryId: catMen.id,
      subcategoryId: subCatMenTshirts.id,
      brandId: brandZara.id,
      images: {
        create: [
          { url: '/uploads/products/crewneck-front.jpg', displayOrder: 0 },
          { url: '/uploads/products/crewneck-back.jpg', displayOrder: 1 },
        ],
      },
      variants: {
        create: [
          {
            sizeId: sizeS.id,
            colorId: colorBlack.id,
            sku: 'TSH-COT-BLK-S',
            priceAdjustment: 0.00,
            stockQuantity: 20,
            isDefault: true,
          },
          {
            sizeId: sizeM.id,
            colorId: colorBlack.id,
            sku: 'TSH-COT-BLK-M',
            priceAdjustment: 0.00,
            stockQuantity: 15,
            isDefault: false,
          },
          {
            sizeId: sizeL.id,
            colorId: colorNavy.id,
            sku: 'TSH-COT-NVY-L',
            priceAdjustment: 20.00,
            stockQuantity: 10,
            isDefault: false,
          },
        ],
      },
    },
    include: { variants: true },
  });

  // Product 2: Slim Fit Stretch Chino Pants
  await prisma.product.create({
    data: {
      title: 'Slim Fit Stretch Chino Pants',
      slug: 'slim-fit-stretch-chino-pants',
      description: 'Comfortable slim-fit chinos crafted from breathable cotton twill with an added touch of elastane for movement.',
      price: 850.00,
      priceAfterDiscount: null,
      imageCover: '/uploads/products/chino-navy.jpg',
      sold: 8,
      categoryId: catMen.id,
      subcategoryId: subCatMenPants.id,
      brandId: brandZara.id,
      variants: {
        create: [
          {
            sizeId: sizeM.id,
            colorId: colorNavy.id,
            sku: 'PNT-CHN-NVY-M',
            priceAdjustment: 0.00,
            stockQuantity: 25,
            isDefault: true,
          },
          {
            sizeId: sizeL.id,
            colorId: colorBlack.id,
            sku: 'PNT-CHN-BLK-L',
            priceAdjustment: 0.00,
            stockQuantity: 18,
            isDefault: false,
          },
        ],
      },
    },
  });

  // Product 3: Floral Tiered Summer Maxi Dress (Discounted)
  await prisma.product.create({
    data: {
      title: 'Floral Tiered Summer Maxi Dress',
      slug: 'floral-tiered-summer-maxi-dress',
      description: 'Breezy tiered maxi dress adorned with delicate floral prints, a flattering V-neck, and flutter sleeves.',
      price: 1200.00,
      priceAfterDiscount: 990.00,
      imageCover: '/uploads/products/maxi-dress-white.jpg',
      sold: 5,
      categoryId: catWomen.id,
      subcategoryId: subCatWomenDresses.id,
      brandId: brandZara.id,
      variants: {
        create: [
          {
            sizeId: sizeS.id,
            colorId: colorWhite.id,
            sku: 'DRS-FLR-WHT-S',
            priceAdjustment: 0.00,
            stockQuantity: 12,
            isDefault: true,
          },
          {
            sizeId: sizeM.id,
            colorId: colorNavy.id,
            sku: 'DRS-FLR-NVY-M',
            priceAdjustment: 30.00,
            stockQuantity: 8,
            isDefault: false,
          },
        ],
      },
    },
  });

  // Product 4: Sportswear Oversized Knit Pullover
  await prisma.product.create({
    data: {
      title: 'Sportswear Oversized Knit Pullover',
      slug: 'sportswear-oversized-knit-pullover',
      description: 'Relaxed silhouette knit pullover with dropped shoulders, ribbed cuffs, and iconic athletic styling.',
      price: 950.00,
      priceAfterDiscount: null,
      imageCover: '/uploads/products/pullover-black.jpg',
      sold: 12,
      categoryId: catWomen.id,
      subcategoryId: subCatWomenTops.id,
      brandId: brandNike.id,
      variants: {
        create: [
          {
            sizeId: sizeM.id,
            colorId: colorBlack.id,
            sku: 'TOP-PLV-BLK-M',
            priceAdjustment: 0.00,
            stockQuantity: 30,
            isDefault: true,
          },
          {
            sizeId: sizeL.id,
            colorId: colorWhite.id,
            sku: 'TOP-PLV-WHT-L',
            priceAdjustment: 0.00,
            stockQuantity: 22,
            isDefault: false,
          },
        ],
      },
    },
  });

  // Product 5: Kids Active 3-Stripes Zip Hoodie (Discounted)
  await prisma.product.create({
    data: {
      title: 'Kids Active 3-Stripes Zip Hoodie',
      slug: 'kids-active-3-stripes-zip-hoodie',
      description: 'Signature 3-stripes fleece zip hoodie providing lightweight warmth and everyday durability for active kids.',
      price: 600.00,
      priceAfterDiscount: 500.00,
      imageCover: '/uploads/products/kids-hoodie-navy.jpg',
      sold: 20,
      categoryId: catKids.id,
      subcategoryId: subCatKidsBoys.id,
      brandId: brandAdidas.id,
      variants: {
        create: [
          {
            sizeId: sizeS.id,
            colorId: colorNavy.id,
            sku: 'KID-HOD-NVY-S',
            priceAdjustment: 0.00,
            stockQuantity: 14,
            isDefault: true,
          },
          {
            sizeId: sizeM.id,
            colorId: colorBlack.id,
            sku: 'KID-HOD-BLK-M',
            priceAdjustment: 0.00,
            stockQuantity: 16,
            isDefault: false,
          },
        ],
      },
    },
  });

  // Product 6: Graphic Heritage Essential Tee (Stock = 0 for Out-of-Stock Edge Case Testing)
  await prisma.product.create({
    data: {
      title: 'Graphic Heritage Essential Tee',
      slug: 'graphic-heritage-essential-tee',
      description: 'Vintage inspired graphic print tee designed for lightweight comfort and casual streetwear style.',
      price: 300.00,
      priceAfterDiscount: null,
      imageCover: '/uploads/products/graphic-tee-white.jpg',
      sold: 50,
      categoryId: catMen.id,
      subcategoryId: subCatMenTshirts.id,
      brandId: brandNike.id,
      variants: {
        create: [
          {
            sizeId: sizeM.id,
            colorId: colorWhite.id,
            sku: 'TSH-GRP-WHT-M',
            priceAdjustment: 0.00,
            stockQuantity: 0, // OUT OF STOCK EDGE CASE
            isDefault: true,
          },
        ],
      },
    },
  });

  // 7. Coupons
  console.log('🎟️ Seeding Coupons...');
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10.00,
      minOrderValue: 200.00,
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
      expiresAt: nextYear,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'EGYPT50',
      discountType: DiscountType.FIXED,
      discountValue: 50.00,
      minOrderValue: 500.00,
      usageLimit: 50,
      usedCount: 0,
      isActive: true,
      expiresAt: nextYear,
    },
  });

  // 8. Wishlist & Reviews
  console.log('⭐ Seeding Wishlist & Reviews...');
  await prisma.wishlistItem.create({
    data: {
      userId: user.id,
      productId: product1.id,
    },
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      productId: product1.id,
      rating: 5,
      title: 'High Quality Combed Cotton',
      comment: 'Excellent breathable fabric and fits perfectly true to size!',
    },
  });

  // 9. Cart & CartItem
  console.log('🛒 Seeding Cart & CartItem...');
  const defaultVariantProd1 = product1.variants.find((v) => v.isDefault)!;
  await prisma.cart.create({
    data: {
      userId: user.id,
      items: {
        create: [
          {
            variantId: defaultVariantProd1.id,
            quantity: 2,
            price: 350.00, // Matches discounted price
          },
        ],
      },
    },
  });

  console.log('✅ Deterministic database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
