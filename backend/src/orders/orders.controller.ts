import {
  Controller,
  Get,
  Post,
  Put,
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
import { OrdersService } from './orders.service';
import { CreateOrderDto, ShippingAddressDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Orders')
@ApiExtraModels(CreateOrderDto, ShippingAddressDto)
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(OrdersService) private readonly ordersService: OrdersService,
  ) {}

  @Post('checkout-session/:cartId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Create Stripe checkout session for online payment',
    description:
      'Initiates a Stripe hosted checkout session for the items in the user cart. Returns session ID and redirection URL.',
  })
  @ApiParam({
    name: 'cartId',
    description: 'Cart UUID or user ID representing the shopping cart to checkout',
    example: '0b6cdbcd-8664-44b6-99b0-026dc7791853',
  })
  @ApiQuery({
    name: 'url',
    required: false,
    description: 'Frontend base URL for return redirects',
    example: 'http://localhost:3000',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Stripe checkout session created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cart is empty or item quantity exceeds available stock',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  async createCheckoutSession(
    @CurrentUser('id') userId: string,
    @Param('cartId') cartId: string,
    @Query('url') clientUrl: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createCheckoutSession(userId, cartId, clientUrl, dto);
  }

  @Post('verify-payment/:sessionId')
  @ApiOperation({
    summary: 'Verify online payment session completion',
    description:
      'Public webhook and redirect callback verifying Stripe checkout session completion, marking order as paid, and decrementing stock.',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Stripe Checkout Session ID (cs_test_...)',
    example: 'cs_test_b1346978-7c45-4967-9845-8480bf1b644d',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment verified and order marked paid successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment session or order not found',
  })
  async verifyPayment(@Param('sessionId') sessionId: string) {
    return this.ordersService.verifyAndCompletePayment(sessionId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Get user order history',
    description:
      'Retrieves all orders placed by the specified user as a direct array of order objects.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID whose order history is requested',
    example: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  })
  @ApiResponse({
    status: 200,
    description: 'User orders retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing authentication token',
  })
  async getUserOrders(@Param('userId') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @Put(':id/pay')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Mark order as paid',
    description:
      'Admin endpoint to manually transition an order to paid status (PROCESSING). Supports order UUID or numeric order number.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order UUID or numeric orderNumber',
    example: '10',
  })
  @ApiResponse({
    status: 200,
    description: 'Order successfully marked as paid',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async markAsPaid(@Param('id') id: string) {
    return this.ordersService.updateOrderToPaid(id);
  }

  @Put(':id/deliver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Mark order as delivered',
    description:
      'Admin endpoint to transition an order to delivered status (DELIVERED). Supports order UUID or numeric order number.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order UUID or numeric orderNumber',
    example: '10',
  })
  @ApiResponse({
    status: 200,
    description: 'Order successfully marked as delivered',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async markAsDelivered(@Param('id') id: string) {
    return this.ordersService.updateOrderToDelivered(id);
  }

  @Post(':cartId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Create cash-on-delivery order',
    description:
      'Places a cash-on-delivery order for the items in the user cart, applies optional coupons, decrements inventory, and empties the cart.',
  })
  @ApiParam({
    name: 'cartId',
    description: 'Cart UUID or user ID representing the cart to convert into an order',
    example: '0b6cdbcd-8664-44b6-99b0-026dc7791853',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Cash order placed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cart is empty or requested clothing quantities exceed current stock',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart or coupon not found',
  })
  async createCashOrder(
    @CurrentUser('id') userId: string,
    @Param('cartId') cartId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createCashOrder(userId, cartId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Get all platform orders',
    description:
      'Admin endpoint returning paginated list of all customer orders across the platform.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of orders per page',
    example: 20,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of orders retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires ADMIN role',
  })
  async getAllOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.getAllOrders(page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Get order by ID or orderNumber',
    description:
      'Retrieves complete order details using either the UUID or the numeric order number.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order UUID or numeric orderNumber',
    example: '2f87dc8b-35d7-457f-a0b1-a8f1fe0e529c',
  })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }
}
