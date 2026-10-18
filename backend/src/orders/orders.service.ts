import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CouponsService) private readonly couponsService: CouponsService,
  ) {}

  formatOrder(order: any) {
    if (!order) return null;

    const cartItems = (order.items || []).map((item: any) => ({
      _id: item.id,
      id: item.id,
      count: item.quantity,
      price: Number(item.price),
      product: {
        _id: item.variant?.product?.id || item.variantId,
        id: item.variant?.product?.id || item.variantId,
        title: item.productTitle,
        imageCover: item.imageCover,
        ratingsAverage: item.variant?.product?.ratingsAverage
          ? Number(item.variant.product.ratingsAverage)
          : 4.5,
        category: item.variant?.product?.category,
        brand: item.variant?.product?.brand,
      },
    }));

    return {
      _id: order.id,
      id: order.orderNumber,
      orderNumber: order.orderNumber,
      shippingAddress: {
        details: order.shippingAddressDetails,
        phone: order.shippingAddressPhone,
        city: order.shippingAddressCity,
        postalCode: order.shippingPostalCode,
      },
      taxPrice: Number(order.taxPrice),
      shippingPrice: Number(order.shippingPrice),
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discountAmount),
      totalOrderPrice: Number(order.totalOrderPrice),
      paymentMethodType: order.paymentMethod === 'CASH' ? 'cash' : 'card',
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      status: order.status,
      user: order.user
        ? {
            _id: order.user.id,
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
            phone: order.user.phone || order.shippingAddressPhone,
          }
        : undefined,
      cartItems,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      __v: 0,
    };
  }

  private resolveShipping(dto: CreateOrderDto) {
    return {
      details: dto.shippingAddress?.details || dto.details || 'Default Shipping Address',
      city: dto.shippingAddress?.city || dto.city || 'Cairo',
      phone: dto.shippingAddress?.phone || dto.phone || '01000000000',
      postalCode: dto.shippingAddress?.postalCode || dto.postalCode || null,
    };
  }

  private async getCartForOrder(cartIdOrUserId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: {
        OR: [{ id: cartIdOrUserId }, { userId: cartIdOrUserId }],
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
                size: true,
                color: true,
              },
            },
          },
        },
      },
    });

    return cart;
  }

  async createCashOrder(userId: string, cartId: string, dto: CreateOrderDto) {
    const cart = await this.getCartForOrder(cartId);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('There is no cart with items for this user to create an order');
    }

    // Verify stock
    for (const item of cart.items) {
      if (item.quantity > item.variant.stockQuantity) {
        throw new BadRequestException(
          `Insufficient stock for '${item.variant.product.title}' (${item.variant.sku}). Available: ${item.variant.stockQuantity}`,
        );
      }
    }

    const shipping = this.resolveShipping(dto);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    let discountAmount = 0;
    let couponRecord: any = null;
    if (dto.coupon) {
      const discountResult = await this.couponsService.validateAndCalculateDiscount(
        dto.coupon,
        subtotal,
      );
      discountAmount = discountResult.discountAmount;
      couponRecord = discountResult.coupon;
    }

    const totalOrderPrice = Math.max(0, subtotal - discountAmount);

    // Transactional Order Creation + Inventory decrement + Cart clear
    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          paymentMethod: 'CASH',
          isPaid: false,
          isDelivered: false,
          status: 'PENDING',
          subtotal,
          discountAmount,
          taxPrice: 0,
          shippingPrice: 0,
          totalOrderPrice,
          couponId: couponRecord ? couponRecord.id : null,
          couponCode: couponRecord ? couponRecord.code : null,
          couponDiscountType: couponRecord ? couponRecord.discountType : null,
          couponDiscountValue: couponRecord ? couponRecord.discountValue : null,
          shippingAddressDetails: shipping.details,
          shippingAddressPhone: shipping.phone,
          shippingAddressCity: shipping.city,
          shippingPostalCode: shipping.postalCode,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              productTitle: item.variant.product.title,
              sizeName: item.variant.size.name,
              colorName: item.variant.color.name,
              sku: item.variant.sku,
              imageCover: item.variant.product.imageCover,
            })),
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
          user: true,
        },
      });

      // Update coupon usage
      if (couponRecord) {
        await tx.coupon.update({
          where: { id: couponRecord.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Decrement stock & increment sold
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        await tx.product.update({
          where: { id: item.variant.productId },
          data: { sold: { increment: item.quantity } },
        });
      }

      // Clear user cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return createdOrder;
    });

    return {
      status: 'success',
      data: this.formatOrder(order),
    };
  }

  async createCheckoutSession(
    userId: string,
    cartId: string,
    clientUrl: string,
    dto: CreateOrderDto,
  ) {
    const cart = await this.getCartForOrder(cartId);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('There is no cart with items for this user to create an order');
    }

    for (const item of cart.items) {
      if (item.quantity > item.variant.stockQuantity) {
        throw new BadRequestException(
          `Insufficient stock for '${item.variant.product.title}'. Available: ${item.variant.stockQuantity}`,
        );
      }
    }

    const shipping = this.resolveShipping(dto);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    let discountAmount = 0;
    let couponRecord: any = null;
    if (dto.coupon) {
      const discountResult = await this.couponsService.validateAndCalculateDiscount(
        dto.coupon,
        subtotal,
      );
      discountAmount = discountResult.discountAmount;
      couponRecord = discountResult.coupon;
    }

    const totalOrderPrice = Math.max(0, subtotal - discountAmount);
    const sessionId = `cs_test_${randomUUID()}`;
    const baseUrl = clientUrl || 'http://localhost:3000';
    const successUrl = `${baseUrl}/allorders?session_id=${sessionId}`;
    const cancelUrl = `${baseUrl}/cart`;

    // Create pending order and payment record
    const order = await this.prisma.order.create({
      data: {
        userId,
        paymentMethod: 'ONLINE',
        isPaid: false,
        isDelivered: false,
        status: 'PENDING',
        subtotal,
        discountAmount,
        taxPrice: 0,
        shippingPrice: 0,
        totalOrderPrice,
        couponId: couponRecord ? couponRecord.id : null,
        couponCode: couponRecord ? couponRecord.code : null,
        shippingAddressDetails: shipping.details,
        shippingAddressPhone: shipping.phone,
        shippingAddressCity: shipping.city,
        shippingPostalCode: shipping.postalCode,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            productTitle: item.variant.product.title,
            sizeName: item.variant.size.name,
            colorName: item.variant.color.name,
            sku: item.variant.sku,
            imageCover: item.variant.product.imageCover,
          })),
        },
        payment: {
          create: {
            paymentProvider: 'STRIPE',
            stripeSessionId: sessionId,
            amount: totalOrderPrice,
            currency: 'EGP',
            status: 'PENDING',
          },
        },
      },
    });

    const sessionObj = {
      id: sessionId,
      url: successUrl,
      success_url: successUrl,
      cancel_url: cancelUrl,
      orderId: order.id,
      amount_total: Math.round(totalOrderPrice * 100),
      currency: 'egp',
    };

    return {
      status: 'success',
      session: sessionObj,
    };
  }

  async verifyAndCompletePayment(sessionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment session '${sessionId}' not found`);
    }

    if (payment.status === 'SUCCESS') {
      return {
        status: 'success',
        message: 'Payment already completed',
        data: this.formatOrder(payment.order),
      };
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // 1. Update Payment
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCESS' },
      });

      // 2. Update Order
      const ord = await tx.order.update({
        where: { id: payment.orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          status: 'PROCESSING',
        },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
          user: true,
        },
      });

      // 3. Decrement stock & increment sold
      for (const item of ord.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        await tx.product.update({
          where: { id: item.variant.productId },
          data: { sold: { increment: item.quantity } },
        });
      }

      // 4. Clear user cart
      const userCart = await tx.cart.findUnique({ where: { userId: ord.userId } });
      if (userCart) {
        await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
      }

      return ord;
    });

    return {
      status: 'success',
      message: 'Payment verified and order confirmed successfully',
      data: this.formatOrder(updatedOrder),
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: true,
      },
    });

    // Return the array directly as expected by frontend: const orders = await getAllUserOrders(userId); orders.sort(...)
    return orders.map((o) => this.formatOrder(o));
  }

  async getAllOrders(page = 1, limit = 20) {
    const take = Number(limit) > 0 ? Number(limit) : 20;
    const skip = (Number(page) > 0 ? Number(page) - 1 : 0) * take;

    const [total, orders] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
          user: true,
        },
      }),
    ]);

    return {
      status: 'success',
      results: orders.length,
      paginationResult: {
        currentPage: Number(page),
        limit: take,
        numberOfPages: Math.ceil(total / take) || 1,
        total,
      },
      data: orders.map((o) => this.formatOrder(o)),
    };
  }

  async getOrderById(id: string) {
    const isNum = !isNaN(Number(id));
    const where: any = isNum ? { orderNumber: Number(id) } : { id };

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order '${id}' not found`);
    }

    return {
      status: 'success',
      data: this.formatOrder(order),
    };
  }

  async updateOrderToPaid(id: string) {
    const isNum = !isNaN(Number(id));
    const where: any = isNum ? { orderNumber: Number(id) } : { id };

    const order = await this.prisma.order.findFirst({ where });
    if (!order) {
      throw new NotFoundException(`Order '${id}' not found`);
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        isPaid: true,
        paidAt: new Date(),
        status: 'PROCESSING',
      },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        user: true,
      },
    });

    return {
      status: 'success',
      message: 'Order marked as paid',
      data: this.formatOrder(updated),
    };
  }

  async updateOrderToDelivered(id: string) {
    const isNum = !isNaN(Number(id));
    const where: any = isNum ? { orderNumber: Number(id) } : { id };

    const order = await this.prisma.order.findFirst({ where });
    if (!order) {
      throw new NotFoundException(`Order '${id}' not found`);
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
        status: 'DELIVERED',
      },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        user: true,
      },
    });

    return {
      status: 'success',
      message: 'Order marked as delivered',
      data: this.formatOrder(updated),
    };
  }
}
