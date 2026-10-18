import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    type: String,
    description: 'Unique brand name',
    example: 'Zara',
  })
  @IsNotEmpty({ message: 'Brand name is required' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Brand logo image URL or path',
    example: '/uploads/brands/zara.png',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'SEO URL slug (auto-generated if omitted)',
    example: 'zara',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}
