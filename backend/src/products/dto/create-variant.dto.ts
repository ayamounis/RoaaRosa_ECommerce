import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({
    type: String,
    description: 'Size UUID (e.g. S, M, L, XL)',
    example: 'f8e7d6c5-b4a3-2109-8765-4321fedcba09',
  })
  @IsNotEmpty({ message: 'Size ID is required' })
  @IsUUID('4')
  sizeId: string;

  @ApiProperty({
    type: String,
    description: 'Color UUID (e.g. Navy Blue #000080)',
    example: 'e7d6c5b4-a321-0987-6543-21fedcba0987',
  })
  @IsNotEmpty({ message: 'Color ID is required' })
  @IsUUID('4')
  colorId: string;

  @ApiPropertyOptional({
    type: String,
    description:
      'Stock Keeping Unit identifier (auto-generated if omitted)',
    example: 'TSH-COT-BLK-L',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    type: Number,
    description:
      'Price differential for this variant relative to base price in EGP',
    example: 50.0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceAdjustment?: number = 0;

  @ApiProperty({
    type: Number,
    description:
      'Available inventory stock count for this size/color combination',
    example: 15,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Stock quantity is required' })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Stock quantity cannot be negative' })
  stockQuantity: number;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Set as primary display variant on product page',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;
}
