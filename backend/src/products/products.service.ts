import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';

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

function formatProduct(p: any): any {
  const images = p.images ? p.images.map((img: any) => img.url) : [];
  if (images.length === 0 && p.imageCover) {
    images.push(p.imageCover);
  }

  const totalQuantity = p.variants
    ? p.variants.reduce((acc: number, v: any) => acc + (v.stockQuantity || 0), 0)
    : 0;

  return {
    id: p.id,
    _id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    priceAfterDiscount: p.priceAfterDiscount ? Number(p.priceAfterDiscount) : null,
    imageCover: p.imageCover,
    images,
    sold: p.sold,
    ratingsAverage: Number(p.ratingsAverage),
    ratingsQuantity: p.ratingsQuantity,
    quantity: totalQuantity,
    categoryId: p.categoryId,
    category: p.category,
    subcategoryId: p.subcategoryId,
    subCategory: p.subCategory,
    subcategory: p.subCategory, // frontend compatibility
    brandId: p.brandId,
    brand: p.brand,
    variants: p.variants
      ? p.variants.map((v: any) => ({
          id: v.id,
          _id: v.id,
          sku: v.sku,
          priceAdjustment: Number(v.priceAdjustment),
          stockQuantity: v.stockQuantity,
          isDefault: v.isDefault,
          sizeId: v.sizeId,
          size: v.size,
          colorId: v.colorId,
          color: v.color,
        }))
      : [],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

@Injectable()
export class ProductsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll(rawQuery: any = {}) {
    const page = Math.max(1, parseInt(rawQuery.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(rawQuery.limit, 10) || 40));
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {
      isActive: true,
    };

    // 1. Category Filter (supports query['category[in]'] or query.category?.in or query.category)
    const isUUID = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const categoryIn = rawQuery['category[in]'] || (rawQuery.category && rawQuery.category.in) || rawQuery.category;
    if (categoryIn && categoryIn !== 'all') {
      const rawCategories = Array.isArray(categoryIn) ? categoryIn : [categoryIn];
      const validUuids = rawCategories.filter(isUUID);
      const slugs = rawCategories.filter((c: string) => !isUUID(c) && c !== 'all');

      const resolvedIds = [...validUuids];
      if (slugs.length > 0) {
        const found = await this.prisma.category.findMany({
          where: { slug: { in: slugs } },
          select: { id: true },
        });
        resolvedIds.push(...found.map((c) => c.id));
      }

      if (resolvedIds.length > 0) {
        where.categoryId = { in: resolvedIds };
      }
    }

    // 2. Brand Filter
    const brandIn = rawQuery['brand[in]'] || (rawQuery.brand && rawQuery.brand.in) || rawQuery.brand;
    if (brandIn && brandIn !== 'all') {
      const rawBrands = Array.isArray(brandIn) ? brandIn : [brandIn];
      const validUuids = rawBrands.filter(isUUID);
      const slugs = rawBrands.filter((b: string) => !isUUID(b) && b !== 'all');

      const resolvedIds = [...validUuids];
      if (slugs.length > 0) {
        const found = await this.prisma.brand.findMany({
          where: { slug: { in: slugs } },
          select: { id: true },
        });
        resolvedIds.push(...found.map((b) => b.id));
      }

      if (resolvedIds.length > 0) {
        where.brandId = { in: resolvedIds };
      }
    }

    // 3. Price Filter (price[gte], price[lte])
    const priceGte = rawQuery['price[gte]'] || (rawQuery.price && rawQuery.price.gte);
    const priceLte = rawQuery['price[lte]'] || (rawQuery.price && rawQuery.price.lte);
    if (priceGte !== undefined || priceLte !== undefined) {
      where.price = {};
      if (priceGte !== undefined) where.price.gte = parseFloat(priceGte);
      if (priceLte !== undefined) where.price.lte = parseFloat(priceLte);
    }

    // 4. Keyword search (title / description)
    if (rawQuery.keyword) {
      where.OR = [
        { title: { contains: rawQuery.keyword, mode: 'insensitive' } },
        { description: { contains: rawQuery.keyword, mode: 'insensitive' } },
      ];
    }

    // 5. Sorting
    let orderBy: Record<string, any> = { createdAt: 'desc' };
    const sortParam = rawQuery.sort;
    if (sortParam) {
      if (sortParam === '-price') orderBy = { price: 'desc' };
      else if (sortParam === 'price' || sortParam === '+price') orderBy = { price: 'asc' };
      else if (sortParam === '-sold') orderBy = { sold: 'desc' };
      else if (sortParam === '-ratingsAverage') orderBy = { ratingsAverage: 'desc' };
      else if (sortParam === 'title') orderBy = { title: 'asc' };
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          subCategory: true,
          brand: true,
          images: { orderBy: { displayOrder: 'asc' } },
          variants: {
            where: { isActive: true },
            include: { size: true, color: true },
          },
        },
      }),
    ]);

    const formattedData = products.map((p) => formatProduct(p));

    return {
      results: formattedData.length,
      metadata: {
        currentPage: page,
        numberOfPages: Math.ceil(total / limit) || 1,
        limit,
        total,
      },
      data: formattedData,
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: {
          where: { isActive: true },
          include: { size: true, color: true },
        },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      data: formatProduct(product),
    };
  }

  async create(dto: CreateProductDto) {
    if (dto.priceAfterDiscount !== undefined && dto.priceAfterDiscount > dto.price) {
      throw new BadRequestException('priceAfterDiscount cannot be greater than price');
    }

    const slug = slugify(dto.title);
    const existing = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new BadRequestException('Product with this title already exists');
    }

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category ${dto.categoryId} not found`);
    }

    // Transaction to create product + images + default variant
    const product = await this.prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          title: dto.title,
          slug,
          description: dto.description,
          price: dto.price,
          priceAfterDiscount: dto.priceAfterDiscount ?? null,
          imageCover: dto.imageCover,
          categoryId: dto.categoryId,
          subcategoryId: dto.subcategoryId ?? null,
          brandId: dto.brandId ?? null,
          images: dto.images && dto.images.length > 0
            ? {
                create: dto.images.map((url, idx) => ({
                  url,
                  displayOrder: idx,
                })),
              }
            : undefined,
        },
      });

      // If initial variant dimensions were supplied
      if (dto.sizeId && dto.colorId) {
        await tx.productVariant.create({
          data: {
            productId: created.id,
            sizeId: dto.sizeId,
            colorId: dto.colorId,
            sku: `${created.slug.substring(0, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`,
            stockQuantity: dto.stockQuantity ?? 10,
            isDefault: true,
          },
        });
      }

      return tx.product.findUnique({
        where: { id: created.id },
        include: {
          category: true,
          subCategory: true,
          brand: true,
          images: true,
          variants: { include: { size: true, color: true } },
        },
      });
    });

    return {
      data: formatProduct(product),
    };
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    await this.findById(id);

    const data: Record<string, any> = {};
    if (dto.title) {
      data.title = dto.title;
      data.slug = slugify(dto.title);
    }
    if (dto.description) data.description = dto.description;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.priceAfterDiscount !== undefined) data.priceAfterDiscount = dto.priceAfterDiscount;
    if (dto.imageCover) data.imageCover = dto.imageCover;
    if (dto.categoryId) data.categoryId = dto.categoryId;
    if (dto.subcategoryId !== undefined) data.subcategoryId = dto.subcategoryId;
    if (dto.brandId !== undefined) data.brandId = dto.brandId;

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        subCategory: true,
        brand: true,
        images: true,
        variants: { include: { size: true, color: true } },
      },
    });

    return {
      data: formatProduct(updated),
    };
  }

  async remove(id: string) {
    await this.findById(id);

    // Soft delete product to protect historical orders and cart items
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return {
      message: 'Product deleted successfully',
    };
  }

  // Variant management
  async getVariants(productId: string) {
    await this.findById(productId);

    const variants = await this.prisma.productVariant.findMany({
      where: { productId, isActive: true },
      include: { size: true, color: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });

    return {
      results: variants.length,
      data: variants.map((v) => ({
        id: v.id,
        _id: v.id,
        sku: v.sku,
        priceAdjustment: Number(v.priceAdjustment),
        stockQuantity: v.stockQuantity,
        isDefault: v.isDefault,
        sizeId: v.sizeId,
        size: v.size,
        colorId: v.colorId,
        color: v.color,
      })),
    };
  }

  async addVariant(productId: string, dto: CreateVariantDto) {
    const product = await this.findById(productId);

    const sku = dto.sku || `${product.data.slug.substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    if (dto.isDefault) {
      await this.prisma.productVariant.updateMany({
        where: { productId },
        data: { isDefault: false },
      });
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        sizeId: dto.sizeId,
        colorId: dto.colorId,
        sku,
        priceAdjustment: dto.priceAdjustment ?? 0,
        stockQuantity: dto.stockQuantity,
        isDefault: dto.isDefault ?? false,
      },
      include: { size: true, color: true },
    });

    return {
      data: {
        id: variant.id,
        _id: variant.id,
        sku: variant.sku,
        priceAdjustment: Number(variant.priceAdjustment),
        stockQuantity: variant.stockQuantity,
        isDefault: variant.isDefault,
        size: variant.size,
        color: variant.color,
      },
    };
  }
}
