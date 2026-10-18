import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Product UUID being reviewed',
    example: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  })
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Frontend alias for productId',
    example: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  })
  @IsOptional()
  product?: string;

  @ApiProperty({
    type: Number,
    description: 'Product rating from 1 to 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty({ message: 'rating is required' })
  @IsInt({ message: 'rating must be an integer' })
  @Min(1, { message: 'rating must be between 1 and 5' })
  @Max(5, { message: 'rating must be between 1 and 5' })
  rating: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Review summary title',
    example: 'Exceptional linen fabric and fit',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Detailed customer review comments',
    example:
      'Lightweight, breathable summer shirt with immaculate stitching.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
