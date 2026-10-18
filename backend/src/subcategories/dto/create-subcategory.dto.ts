import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({
    type: String,
    description: 'Subcategory name',
    example: 'Men T-Shirts',
  })
  @IsNotEmpty({ message: 'Subcategory name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Parent category UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId: string;

  @ApiPropertyOptional({
    type: String,
    description: 'SEO URL slug (auto-generated if omitted)',
    example: 'men-t-shirts',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}
