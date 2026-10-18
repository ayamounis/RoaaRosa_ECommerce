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
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Coupons')
@ApiBearerAuth('bearer')
@ApiSecurity('token')
@ApiExtraModels(CreateCouponDto, UpdateCouponDto)
@Controller('coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CouponsController {
  constructor(
    @Inject(CouponsService) private readonly couponsService: CouponsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List all coupons (Admin)',
    description:
      'Retrieves paginated list of all coupons. Requires ADMIN role.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page index',
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
    description: 'Coupons retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  async getCoupons(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.couponsService.getCoupons(page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get coupon by ID (Admin)',
    description:
      'Retrieves coupon configuration by UUID. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Coupon details returned.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({ status: 404, description: 'Coupon not found.' })
  async getCouponById(@Param('id') id: string) {
    return this.couponsService.getCouponById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create coupon (Admin)',
    description:
      'Creates a new promotional discount coupon. Code is auto-uppercased. Requires ADMIN role.',
  })
  @ApiBody({ type: CreateCouponDto })
  @ApiResponse({ status: 201, description: 'Coupon created successfully.' })
  @ApiResponse({
    status: 400,
    description:
      'Percentage discount exceeds 100% or validation failure.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({ status: 409, description: 'Coupon code already exists.' })
  async createCoupon(@Body() dto: CreateCouponDto) {
    return this.couponsService.createCoupon(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update coupon (Admin)',
    description:
      'Updates existing coupon parameters. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateCouponDto })
  @ApiResponse({
    status: 200,
    description: 'Coupon updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({ status: 404, description: 'Coupon not found.' })
  async updateCoupon(
    @Param('id') id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.couponsService.updateCoupon(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete coupon (Admin)',
    description:
      'Permanently deletes a coupon. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Coupon deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({ status: 404, description: 'Coupon not found.' })
  async deleteCoupon(@Param('id') id: string) {
    return this.couponsService.deleteCoupon(id);
  }
}
