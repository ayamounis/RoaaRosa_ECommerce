import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    description: 'Unique category display name',
    example: "Men's Fashion",
  })
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL or path to category banner image',
    example: '/uploads/categories/men.png',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'SEO URL slug (auto-generated from name if omitted)',
    example: 'men-fashion',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}
