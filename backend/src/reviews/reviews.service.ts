import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  private async updateProductRatings(productId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const ratingsQuantity = stats._count.rating || 0;
    const ratingsAverage = ratingsQuantity > 0 ? Number((stats._avg.rating || 0).toFixed(2)) : 0.0;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        ratingsQuantity,
        ratingsAverage,
      },
    });
  }

  async getReviews(productId?: string, page = 1, limit = 20) {
    const take = Number(limit) > 0 ? Number(limit) : 20;
    const skip = (Number(page) > 0 ? Number(page) - 1 : 0) * take;

    const where: any = {};
    if (productId) {
      where.productId = productId;
    }

    const [total, reviews] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              imageCover: true,
            },
          },
        },
      }),
    ]);

    return {
      status: 'success',
      results: reviews.length,
      paginationResult: {
        currentPage: Number(page),
        limit: take,
        numberOfPages: Math.ceil(total / take) || 1,
        total,
      },
      data: reviews,
    };
  }

  async getReviewById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            imageCover: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with id '${id}' not found`);
    }

    return {
      status: 'success',
      data: review,
    };
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    const targetProductId = dto.productId || dto.product;
    if (!targetProductId) {
      throw new BadRequestException('productId is required');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: targetProductId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or inactive');
    }

    const existing = await this.prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: targetProductId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already submitted a review for this product');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId: targetProductId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.updateProductRatings(targetProductId);

    return {
      status: 'success',
      message: 'Review created successfully',
      data: review,
    };
  }

  async updateReview(userId: string, userRole: string, id: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with id '${id}' not found`);
    }

    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to update this review');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (dto.rating !== undefined) {
      await this.updateProductRatings(review.productId);
    }

    return {
      status: 'success',
      message: 'Review updated successfully',
      data: updated,
    };
  }

  async deleteReview(userId: string, userRole: string, id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with id '${id}' not found`);
    }

    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    await this.updateProductRatings(review.productId);

    return {
      status: 'success',
      message: 'Review deleted successfully',
    };
  }
}
