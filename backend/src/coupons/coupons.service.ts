import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, DiscountType } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  private formatCoupon(c: any) {
    return {
      _id: c.id,
      id: c.id,
      code: c.code,
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      minOrderValue: Number(c.minOrderValue),
      usageLimit: c.usageLimit,
      usedCount: c.usedCount,
      isActive: c.isActive,
      expiresAt: c.expiresAt,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  async getCoupons(page = 1, limit = 20) {
    const take = Number(limit) > 0 ? Number(limit) : 20;
    const skip = (Number(page) > 0 ? Number(page) - 1 : 0) * take;

    const [total, coupons] = await Promise.all([
      this.prisma.coupon.count(),
      this.prisma.coupon.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      status: 'success',
      results: coupons.length,
      paginationResult: {
        currentPage: Number(page),
        limit: take,
        numberOfPages: Math.ceil(total / take) || 1,
        total,
      },
      data: coupons.map(this.formatCoupon),
    };
  }

  async getCouponById(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with id '${id}' not found`);
    }

    return {
      status: 'success',
      data: this.formatCoupon(coupon),
    };
  }

  async getCouponByCode(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with code '${code}' not found`);
    }

    return {
      status: 'success',
      data: this.formatCoupon(coupon),
    };
  }

  async createCoupon(dto: CreateCouponDto) {
    const normalizedCode = dto.code.trim().toUpperCase();

    if (dto.discountType === DiscountType.PERCENTAGE && dto.discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100%');
    }

    const existing = await this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      throw new ConflictException(`Coupon code '${normalizedCode}' already exists`);
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        code: normalizedCode,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        minOrderValue: dto.minOrderValue ?? 0,
        usageLimit: dto.usageLimit,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        isActive: dto.isActive ?? true,
      },
    });

    return {
      status: 'success',
      message: 'Coupon created successfully',
      data: this.formatCoupon(coupon),
    };
  }

  async updateCoupon(id: string, dto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with id '${id}' not found`);
    }

    const targetType = dto.discountType ?? coupon.discountType;
    const targetValue = dto.discountValue ?? Number(coupon.discountValue);

    if (targetType === DiscountType.PERCENTAGE && targetValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100%');
    }

    const updated = await this.prisma.coupon.update({
      where: { id },
      data: {
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        minOrderValue: dto.minOrderValue,
        usageLimit: dto.usageLimit,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isActive: dto.isActive,
      },
    });

    return {
      status: 'success',
      message: 'Coupon updated successfully',
      data: this.formatCoupon(updated),
    };
  }

  async deleteCoupon(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with id '${id}' not found`);
    }

    await this.prisma.coupon.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Coupon deleted successfully',
    };
  }

  async validateAndCalculateDiscount(code: string, cartTotal: number) {
    const normalizedCode = code.trim().toUpperCase();
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('Invalid or inactive coupon code');
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const minOrder = Number(coupon.minOrderValue);
    if (cartTotal < minOrder) {
      throw new BadRequestException(
        `Order total (${cartTotal} EGP) is below minimum order value (${minOrder} EGP) for this coupon`,
      );
    }

    let discountAmount = 0;
    const discountVal = Number(coupon.discountValue);

    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (cartTotal * discountVal) / 100;
    } else {
      discountAmount = discountVal;
    }

    // Discount cannot exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);
    const finalPrice = Math.max(0, cartTotal - discountAmount);

    return {
      coupon,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
    };
  }
}
