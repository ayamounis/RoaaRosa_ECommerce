import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log('🌸 Seeding ROAROSA Girls Catalog into PostgreSQL...');

  const dataPath = path.resolve(__dirname, 'girls-catalog.json');
  if (!fs.existsSync(dataPath)) {
    console.error('girls-catalog.json not found at:', dataPath);
    return;
  }

  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const { categories, products } = raw;

  // 1. Ensure Brand ROAROSA exists
  const brand = await prisma.brand.upsert({
    where: { slug: 'roarosa' },
    update: {
      name: 'ROAROSA',
      image: '/logo.png',
      isActive: true,
    },
    create: {
      name: 'ROAROSA',
      slug: 'roarosa',
      image: '/logo.png',
      isActive: true,
    },
  });

  // 2. Ensure Colors
  const colorRose = await prisma.color.upsert({
    where: { id: 'c48d8000-0000-0000-0000-000000000001' },
    update: { name: 'Dusty Rose', hexCode: '#C48D80' },
    create: {
      id: 'c48d8000-0000-0000-0000-000000000001',
      name: 'Dusty Rose',
      hexCode: '#C48D80',
    },
  });

  const colorBlush = await prisma.color.upsert({
    where: { id: 'c48d8000-0000-0000-0000-000000000002' },
    update: { name: 'Blush Pink', hexCode: '#E8C5BC' },
    create: {
      id: 'c48d8000-0000-0000-0000-000000000002',
      name: 'Blush Pink',
      hexCode: '#E8C5BC',
    },
  });

  const colorIvory = await prisma.color.upsert({
    where: { id: 'c48d8000-0000-0000-0000-000000000003' },
    update: { name: 'Ivory / Cream', hexCode: '#FAF6F0' },
    create: {
      id: 'c48d8000-0000-0000-0000-000000000003',
      name: 'Ivory / Cream',
      hexCode: '#FAF6F0',
    },
  });

  // 3. Ensure Sizes
  const sizeBaby = await prisma.size.upsert({
    where: { code: '0-2Y' },
    update: { name: 'Baby (0-2 Yrs)', displayOrder: 1 },
    create: {
      code: '0-2Y',
      name: 'Baby (0-2 Yrs)',
      displayOrder: 1,
    },
  });

  const sizeYounger = await prisma.size.upsert({
    where: { code: '3-7Y' },
    update: { name: 'Younger (3-7 Yrs)', displayOrder: 2 },
    create: {
      code: '3-7Y',
      name: 'Younger (3-7 Yrs)',
      displayOrder: 2,
    },
  });

  const sizeOlder = await prisma.size.upsert({
    where: { code: '8-12Y' },
    update: { name: 'Older (8-12 Yrs)', displayOrder: 3 },
    create: {
      code: '8-12Y',
      name: 'Older (8-12 Yrs)',
      displayOrder: 3,
    },
  });

  // 4. Seed Categories
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    if (cat.slug === 'all') continue;

    const upsertedCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        image: cat.image,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        isActive: true,
      },
    });

    categoryMap.set(cat.slug, upsertedCat.id);
    categoryMap.set(cat.id, upsertedCat.id);

    // Also ensure default SubCategory for each Category
    await prisma.subCategory.upsert({
      where: { slug: `${cat.slug}-collection` },
      update: {
        name: `${cat.name} Main`,
        categoryId: upsertedCat.id,
        isActive: true,
      },
      create: {
        name: `${cat.name} Main`,
        slug: `${cat.slug}-collection`,
        categoryId: upsertedCat.id,
        isActive: true,
      },
    });
  }

  console.log(`✅ Seeded ${categoryMap.size / 2} ROAROSA categories`);

  // 5. Seed Products
  let seededProducts = 0;
  for (const prod of products) {
    const catSlug = prod.category?.slug || 'dresses';
    const categoryId = categoryMap.get(catSlug) || categoryMap.get('dresses');
    if (!categoryId) continue;

    const prodSlug = prod.slug || slugify(prod.title);

    // Default size based on ageGroup
    let targetSize = sizeYounger;
    if (prod.ageGroup === 'baby') targetSize = sizeBaby;
    else if (prod.ageGroup === 'older' || prod.ageGroup === 'teen') targetSize = sizeOlder;

    const existingProduct = await prisma.product.findUnique({
      where: { slug: prodSlug },
    });

    let currentProduct;
    if (existingProduct) {
      currentProduct = await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          title: prod.title,
          description: prod.description || prod.title,
          price: prod.price,
          priceAfterDiscount: prod.priceAfterDiscount || null,
          imageCover: prod.imageCover || (prod.images && prod.images[0]) || '/logo.png',
          sold: prod.sold || 10,
          ratingsAverage: prod.ratingsAverage || 4.8,
          ratingsQuantity: prod.ratingsQuantity || 12,
          categoryId,
          brandId: brand.id,
          isActive: true,
        },
      });
    } else {
      currentProduct = await prisma.product.create({
        data: {
          title: prod.title,
          slug: prodSlug,
          description: prod.description || prod.title,
          price: prod.price,
          priceAfterDiscount: prod.priceAfterDiscount || null,
          imageCover: prod.imageCover || (prod.images && prod.images[0]) || '/logo.png',
          sold: prod.sold || 10,
          ratingsAverage: prod.ratingsAverage || 4.8,
          ratingsQuantity: prod.ratingsQuantity || 12,
          categoryId,
          brandId: brand.id,
          isActive: true,
        },
      });
    }

    // Add Product Images
    if (prod.images && prod.images.length > 0) {
      await prisma.productImage.deleteMany({
        where: { productId: currentProduct.id },
      });
      for (let i = 0; i < prod.images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: currentProduct.id,
            url: prod.images[i],
            displayOrder: i,
          },
        });
      }
    }

    // Add Default Product Variant
    const variantSku = `ROA-${prodSlug.toUpperCase().slice(0, 10)}-01`;
    await prisma.productVariant.upsert({
      where: { sku: variantSku },
      update: {
        productId: currentProduct.id,
        sizeId: targetSize.id,
        colorId: colorRose.id,
        stockQuantity: 25,
        isDefault: true,
        isActive: true,
      },
      create: {
        productId: currentProduct.id,
        sizeId: targetSize.id,
        colorId: colorRose.id,
        sku: variantSku,
        stockQuantity: 25,
        isDefault: true,
        isActive: true,
      },
    });

    seededProducts++;
  }

  console.log(`✅ Seeded ${seededProducts} ROAROSA products with variants and images!`);
}

main()
  .catch((e) => {
    console.error('Error seeding ROAROSA catalog:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
