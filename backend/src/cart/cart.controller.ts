import {
  Controller,
  Get,
  Post,
  Put,
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
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { ApplyCouponDto } from '../coupons/dto/apply-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth('bearer')
@ApiSecurity('token')
@ApiExtraModels(AddToCartDto, UpdateCartQuantityDto, ApplyCouponDto)
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    @Inject(CartService) private readonly cartService: CartService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get user cart',
    description:
      'Retrieves the current authenticated user shopping cart with items, prices, and applied coupon.',
  })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: authentication token required.',
  })
  async getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Add product or variant to cart',
    description:
      'Adds an item to the shopping cart. If variantId is omitted, uses the default variant for productId.',
  })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({
    status: 201,
    description: 'Product added successfully to your cart.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Insufficient stock or neither productId nor variantId provided.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Product or variant not found or inactive.',
  })
  async addToCart(
    @CurrentUser('id') userId: string,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, dto);
  }

  @Put('applyCoupon')
  @ApiOperation({
    summary: 'Apply coupon to cart (PUT)',
    description:
      'Applies a valid promotional discount coupon code to the user active shopping cart.',
  })
  @ApiBody({ type: ApplyCouponDto })
  @ApiResponse({
    status: 200,
    description: 'Coupon applied successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Cart is empty, coupon invalid/expired/exhausted, or minOrderValue not met.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async applyCouponPut(
    @CurrentUser('id') userId: string,
    @Body() dto: ApplyCouponDto,
  ) {
    return this.cartService.applyCoupon(userId, dto.coupon);
  }

  @Post('applyCoupon')
  @ApiOperation({
    summary: 'Apply coupon to cart (POST alias)',
    description:
      'Compatibility endpoint to apply promotional discount coupon code to cart.',
  })
  @ApiBody({ type: ApplyCouponDto })
  @ApiResponse({
    status: 200,
    description: 'Coupon applied successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Cart is empty, coupon invalid/expired/exhausted, or minOrderValue not met.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async applyCouponPost(
    @CurrentUser('id') userId: string,
    @Body() dto: ApplyCouponDto,
  ) {
    return this.cartService.applyCoupon(userId, dto.coupon);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update cart item quantity',
    description:
      'Updates the quantity of a cart item by item ID, product ID, or variant ID. Count of 0 removes the item.',
  })
  @ApiParam({
    name: 'id',
    description: 'CartItem ID, Product ID, or Variant ID',
    example: 'e4f5a6b7-8901-2345-6789-abcdef012345',
  })
  @ApiBody({ type: UpdateCartQuantityDto })
  @ApiResponse({
    status: 200,
    description: 'Cart quantity updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Requested count exceeds available stock.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Item not found in cart.' })
  async updateQuantity(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCartQuantityDto,
  ) {
    return this.cartService.updateQuantity(userId, id, dto.count);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove item from cart',
    description:
      'Removes an item from cart by item ID, product ID, or variant ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'CartItem ID, Product ID, or Variant ID',
    example: 'e4f5a6b7-8901-2345-6789-abcdef012345',
  })
  @ApiResponse({ status: 200, description: 'Item removed from cart.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Item not found in cart.' })
  async removeItem(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.cartService.removeItem(userId, id);
  }

  @Delete()
  @ApiOperation({
    summary: 'Clear cart',
    description: 'Removes all items from the user shopping cart.',
  })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
