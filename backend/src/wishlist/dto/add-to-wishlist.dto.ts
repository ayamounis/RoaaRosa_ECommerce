import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
  @ApiProperty({
    type: String,
    description: 'Product UUID to add to wishlist',
    example: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  })
  @IsNotEmpty({ message: 'productId is required' })
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId: string;
}
