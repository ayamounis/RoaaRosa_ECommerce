import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiSecurity,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Wishlist')
@ApiBearerAuth('bearer')
@ApiSecurity('token')
@ApiExtraModels(AddToWishlistDto)
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(
    @Inject(WishlistService) private readonly wishlistService: WishlistService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get user wishlist',
    description:
      'Retrieves all products currently in the user wishlist with catalog details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Wishlist retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Add product to wishlist',
    description:
      'Adds a product to user wishlist (idempotent upsert).',
  })
  @ApiBody({ type: AddToWishlistDto })
  @ApiResponse({
    status: 201,
    description: 'Product added successfully to your wishlist.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Product not found or inactive.',
  })
  async addToWishlist(
    @CurrentUser('id') userId: string,
    @Body() dto: AddToWishlistDto,
  ) {
    return this.wishlistService.addToWishlist(userId, dto.productId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove product from wishlist',
    description:
      'Removes a product from user wishlist by product UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  })
  @ApiResponse({
    status: 200,
    description: 'Product removed successfully from your wishlist.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async removeFromWishlist(
    @CurrentUser('id') userId: string,
    @Param('id') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }
}
