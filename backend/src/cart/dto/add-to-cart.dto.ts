import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiPropertyOptional({
    type: String,
    description:
      'Product UUID (resolves default variant if variantId is omitted)',
    example: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  })
  @IsOptional()
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Specific size/color variant UUID',
    example: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
  })
  @IsOptional()
  @IsUUID('4', { message: 'variantId must be a valid UUID' })
  variantId?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Quantity of items to add to cart',
    example: 2,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number;
}
