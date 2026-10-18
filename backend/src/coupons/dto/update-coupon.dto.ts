import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType } from './create-coupon.dto';

export class UpdateCouponDto {
  @ApiPropertyOptional({
    description: 'Updated discount calculation type',
    enum: DiscountType,
    example: DiscountType.FIXED,
  })
  @IsOptional()
  @IsEnum(DiscountType, {
    message: 'discountType must be PERCENTAGE or FIXED',
  })
  discountType?: DiscountType;

  @ApiPropertyOptional({
    type: Number,
    description:
      'Updated discount value (percentage or fixed discount in EGP)',
    example: 150.0,
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: 'discountValue must be greater than 0' })
  discountValue?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Updated minimum order value in EGP',
    example: 600.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'minOrderValue must be greater than or equal to 0' })
  minOrderValue?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Updated total usage limit count',
    example: 500,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'usageLimit must be at least 1' })
  usageLimit?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Updated expiration date in ISO 8601 format',
    example: '2027-01-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Updated active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
