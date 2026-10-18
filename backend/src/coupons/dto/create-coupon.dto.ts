import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateCouponDto {
  @ApiProperty({
    type: String,
    description: 'Unique coupon promo code (auto-uppercased)',
    example: 'EID2026',
  })
  @IsNotEmpty({ message: 'code is required' })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Discount calculation type (PERCENTAGE or FIXED)',
    enum: DiscountType,
    example: DiscountType.PERCENTAGE,
  })
  @IsNotEmpty({ message: 'discountType is required' })
  @IsEnum(DiscountType, {
    message: 'discountType must be PERCENTAGE or FIXED',
  })
  discountType: DiscountType;

  @ApiProperty({
    type: Number,
    description:
      'Discount amount: percentage (e.g. 20 for 20%) or fixed value in EGP (e.g. 100 for 100 EGP off)',
    example: 20,
    minimum: 0.01,
  })
  @IsNotEmpty({ message: 'discountValue is required' })
  @IsNumber()
  @Min(0.01, { message: 'discountValue must be greater than 0' })
  discountValue: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Minimum cart total required in EGP to apply coupon',
    example: 500.0,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'minOrderValue must be greater than or equal to 0' })
  minOrderValue?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Maximum total redemption count across all users',
    example: 300,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'usageLimit must be at least 1' })
  usageLimit?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Expiration date in ISO 8601 format',
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the coupon is active and redeemable',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
