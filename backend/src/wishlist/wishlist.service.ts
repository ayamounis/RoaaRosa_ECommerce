import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  private formatProduct(p: any) {
    const images = Array.isArray(p.images)
      ? p.images.map((img: any) => (typeof img === 'string' ? img : img.url))
      : [p.imageCover];

    const quantity = Array.isArray(p.variants)
      ? p.variants.reduce((acc: number, v: any) => acc + (v.stockQuantity || 0), 0)
      : 0;

    const subcategory = p.subCategory ? [p.subCategory] : [];

    return {
      _id: p.id,
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      priceAfterDiscount: p.priceAfterDiscount ? Number(p.priceAfterDiscount) : undefined,
      quantity,
      imageCover: p.imageCover,
      images,
      category: p.category,
      brand: p.brand,
      subCategory: p.subCategory,
      subcategory,
      ratingsAverage: Number(p.ratingsAverage),
      ratingsQuantity: p.ratingsQuantity,
      sold: p.sold,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: {
            category: true,
            subCategory: true,
            brand: true,
            images: { orderBy: { displayOrder: 'asc' } },
            variants: true,
          },
        },
      },
    });

    const products = items.map((item) => this.formatProduct(item.product));

    return {
      status: 'success',
      count: products.length,
      data: products,
    };
  }

  async addToWishlist(userId: string, productId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
    let targetProductId = isUuid ? productId : null;

    if (!targetProductId) {
      const found = await this.prisma.product.findFirst({
        where: {
          OR: [{ slug: productId }, { title: productId }],
          isActive: true,
        },
      });
      if (found) {
        targetProductId = found.id;
      }
    }

    if (!targetProductId) {
      throw new NotFoundException('Product not found or inactive');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: targetProductId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or inactive');
    }

    await this.prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId: targetProductId,
        },
      },
      create: {
        userId,
        productId: targetProductId,
      },
      update: {},
    });

    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    return {
      status: 'success',
      message: 'Product added successfully to your wishlist',
      data: items.map((i) => i.productId),
    };
  }

  async removeFromWishlist(userId: string, productId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
    let targetProductId = isUuid ? productId : null;

    if (!targetProductId) {
      const found = await this.prisma.product.findFirst({
        where: {
          OR: [{ slug: productId }, { title: productId }],
        },
      });
      if (found) {
        targetProductId = found.id;
      }
    }

    if (targetProductId) {
      try {
        await this.prisma.wishlistItem.delete({
          where: {
            userId_productId: {
              userId,
              productId: targetProductId,
            },
          },
        });
      } catch {
        // Ignore if item wasn't in wishlist
      }
    }

    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    return {
      status: 'success',
      message: 'Product removed successfully from your wishlist',
      data: items.map((i) => i.productId),
    };
  }
}
