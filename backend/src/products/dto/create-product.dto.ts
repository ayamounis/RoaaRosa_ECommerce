import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    description: 'Product title / name',
    example: 'Classic Cotton Crewneck T-Shirt',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Detailed clothing product description',
    example: 'Premium 100% Egyptian combed cotton crewneck t-shirt with ribbed collar.',
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'Base retail price in Egyptian Pounds (EGP)',
    example: 450.0,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Price must be non-negative' })
  price: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Discounted promotional price in EGP (must be <= price)',
    example: 350.0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceAfterDiscount?: number;

  @ApiProperty({
    type: String,
    description: 'Main hero image URL or path',
    example: '/uploads/products/crewneck-front.jpg',
  })
  @IsNotEmpty({ message: 'Image cover is required' })
  @IsString()
  imageCover: string;

  @ApiPropertyOptional({
    description: 'List of additional gallery image URLs',
    example: [
      '/uploads/products/crewneck-front.jpg',
      '/uploads/products/crewneck-back.jpg',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    type: String,
    description: 'Category UUID to which product belongs',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Subcategory UUID',
    example: 'd3b2c1a0-e5f6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Subcategory ID must be a valid UUID' })
  subcategoryId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Brand UUID',
    example: 'c1d2e3f4-a5b6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Brand ID must be a valid UUID' })
  brandId?: string;

  // Optional initial default variant parameters
  @ApiPropertyOptional({
    type: String,
    description: 'Initial default variant Size UUID (e.g. Size M)',
    example: 'f8e7d6c5-b4a3-2109-8765-4321fedcba09',
  })
  @IsOptional()
  @IsUUID('4')
  sizeId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Initial default variant Color UUID (e.g. Black)',
    example: 'e7d6c5b4-a321-0987-6543-21fedcba0987',
  })
  @IsOptional()
  @IsUUID('4')
  colorId?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Initial inventory quantity for default variant',
    example: 25,
    default: 10,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockQuantity?: number;
}
