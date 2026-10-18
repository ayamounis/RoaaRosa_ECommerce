import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class CartService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CouponsService) private readonly couponsService: CouponsService,
  ) {}

  private formatCartResponse(cart: any, message?: string) {
    if (!cart) {
      return {
        status: 'success',
        numOfCartItems: 0,
        cartId: null,
        data: {
          _id: null,
          cartOwner: null,
          products: [],
          totalCartPrice: 0,
        },
      };
    }

    const products = (cart.items || []).map((item: any) => {
      const p = item.variant.product;
      const subcategory = p.subCategory ? [p.subCategory] : [];

      return {
        _id: item.id,
        id: item.id,
        count: item.quantity,
        price: Number(item.price),
        product: {
          _id: p.id,
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          quantity: item.variant.stockQuantity,
          imageCover: p.imageCover,
          category: p.category,
          brand: p.brand,
          subCategory: p.subCategory,
          subcategory,
          ratingsAverage: Number(p.ratingsAverage),
          ratingsQuantity: p.ratingsQuantity,
          sold: p.sold,
        },
        variant: {
          _id: item.variant.id,
          id: item.variant.id,
          sku: item.variant.sku,
          priceAdjustment: Number(item.variant.priceAdjustment),
          stockQuantity: item.variant.stockQuantity,
          size: item.variant.size,
          color: item.variant.color,
        },
      };
    });

    const totalCartPrice = products.reduce(
      (sum: number, item: any) => sum + item.price * item.count,
      0,
    );

    const response: Record<string, any> = {
      status: 'success',
      numOfCartItems: products.length,
      cartId: cart.id,
      data: {
        _id: cart.id,
        id: cart.id,
        cartOwner: cart.userId,
        products,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        __v: 0,
        totalCartPrice: Math.round(totalCartPrice * 100) / 100,
      },
    };

    if (message) {
      response.message = message;
    }

    return response;
  }

  private async getCartWithItems(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                    subCategory: true,
                    brand: true,
                  },
                },
                size: true,
                color: true,
              },
            },
          },
        },
      },
    });
  }

  async getCart(userId: string) {
    let cart = await this.getCartWithItems(userId);
    if (!cart) {
      // Auto-create empty cart for user so frontend never encounters null
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      category: true,
                      subCategory: true,
                      brand: true,
                    },
                  },
                  size: true,
                  color: true,
                },
              },
            },
          },
        },
      });
    }

    return this.formatCartResponse(cart);
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    if (!dto.productId && !dto.variantId) {
      throw new BadRequestException('Either productId or variantId must be provided');
    }

    const quantity = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;

    // 1. Get or create user cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // 2. Resolve Variant
    let variant: any = null;
    if (dto.variantId) {
      variant = await this.prisma.productVariant.findUnique({
        where: { id: dto.variantId },
        include: { product: true },
      });
      if (!variant || !variant.isActive || !variant.product.isActive) {
        throw new NotFoundException('Specified variant not found or inactive');
      }
    } else if (dto.productId) {
      // Option D: VariantResolver (deterministic lookup: default variant first, then oldest created)
      variant = await this.prisma.productVariant.findFirst({
        where: {
          productId: dto.productId,
          isActive: true,
          isDefault: true,
          product: { isActive: true },
        },
        include: { product: true },
      });

      if (!variant) {
        variant = await this.prisma.productVariant.findFirst({
          where: {
            productId: dto.productId,
            isActive: true,
            product: { isActive: true },
          },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          include: { product: true },
        });
      }

      if (!variant) {
        throw new NotFoundException('No active variants available for this product');
      }
    }

    // 3. Check existing item in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: variant.id,
        },
      },
    });

    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const requestedTotalQty = currentQtyInCart + quantity;

    if (requestedTotalQty > variant.stockQuantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${variant.stockQuantity}, currently in cart: ${currentQtyInCart}`,
      );
    }

    // 4. Calculate unit price (base product priceAfterDiscount or price + variant priceAdjustment)
    const basePrice = Number(variant.product.priceAfterDiscount ?? variant.product.price);
    const adjustment = Number(variant.priceAdjustment || 0);
    const unitPrice = Math.max(0, basePrice + adjustment);

    // 5. Upsert CartItem
    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: requestedTotalQty,
          price: unitPrice,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: variant.id,
          quantity,
          price: unitPrice,
        },
      });
    }

    // 6. Return refreshed cart
    const updatedCart = await this.getCartWithItems(userId);
    return this.formatCartResponse(updatedCart, 'Product added successfully to your cart');
  }

  async updateQuantity(userId: string, itemOrProductId: string, count: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Resolve matching item by CartItem.id, variant.productId, or variantId
    const item = cart.items.find(
      (i) =>
        i.id === itemOrProductId ||
        i.variant.productId === itemOrProductId ||
        i.variantId === itemOrProductId,
    );

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    if (count <= 0) {
      // Remove item if count <= 0
      await this.prisma.cartItem.delete({
        where: { id: item.id },
      });
    } else {
      if (count > item.variant.stockQuantity) {
        throw new BadRequestException(
          `Requested count (${count}) exceeds available stock (${item.variant.stockQuantity})`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: count },
      });
    }

    const updatedCart = await this.getCartWithItems(userId);
    return this.formatCartResponse(updatedCart);
  }

  async removeItem(userId: string, itemOrProductId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Resolve item
    const item = cart.items.find(
      (i) =>
        i.id === itemOrProductId ||
        i.variant.productId === itemOrProductId ||
        i.variantId === itemOrProductId,
    );

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.prisma.cartItem.delete({
      where: { id: item.id },
    });

    const updatedCart = await this.getCartWithItems(userId);
    return this.formatCartResponse(updatedCart);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return {
      message: 'success',
    };
  }

  async applyCoupon(userId: string, couponCode: string) {
    const cart = await this.getCartWithItems(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cannot apply coupon to an empty cart');
    }

    const baseResponse = this.formatCartResponse(cart);
    const cartTotal = baseResponse.data.totalCartPrice;

    const discountResult = await this.couponsService.validateAndCalculateDiscount(
      couponCode,
      cartTotal,
    );

    baseResponse.message = 'Coupon applied successfully';
    baseResponse.data.totalPriceAfterDiscount = discountResult.finalPrice;
    baseResponse.data.totalCartPriceAfterDiscount = discountResult.finalPrice;
    baseResponse.data.appliedCoupon = {
      code: discountResult.coupon.code,
      discountType: discountResult.coupon.discountType,
      discountValue: Number(discountResult.coupon.discountValue),
      discountAmount: discountResult.discountAmount,
    };

    return baseResponse;
  }
}
