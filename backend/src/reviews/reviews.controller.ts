import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiSecurity,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@ApiExtraModels(CreateReviewDto, UpdateReviewDto)
@Controller('reviews')
export class ReviewsController {
  constructor(
    @Inject(ReviewsService) private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List reviews',
    description:
      'Lists reviews with optional filter by productId and pagination.',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter reviews for a specific product UUID',
    example: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated reviews retrieved.',
  })
  async getReviews(
    @Query('productId') productId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.getReviews(productId, page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get review by ID',
    description: 'Retrieves a single review by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({ status: 200, description: 'Review found.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Create review',
    description:
      'Submits a review and rating for a product (one review per user per product).',
  })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Missing product ID, duplicate review, or invalid rating.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Product not found or inactive.',
  })
  async createReview(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(userId, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Update review',
    description:
      'Updates rating and comments of an existing review. Author or Admin only.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: not authorized to update this review.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async updateReview(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(user.id, user.role, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Delete review',
    description:
      'Deletes a review by UUID. Author or Admin only.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: not authorized to delete this review.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async deleteReview(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.reviewsService.deleteReview(user.id, user.role, id);
  }
}
