import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductsDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Pagination page number',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Items per page (max 100)',
    example: 40,
    default: 40,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 40;

  @ApiPropertyOptional({
    type: String,
    description:
      'Sort field: -price (desc), price (asc), -sold, -ratingsAverage, title',
    example: '-price',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Search term matched against title and description',
    example: 'Crewneck',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  // Supports category filter: category[in] or categoryId
  @ApiPropertyOptional({
    type: String,
    description: 'Filter by category UUID (or category[in])',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  category?: any;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by brand UUID (or brand[in])',
    example: 'c1d2e3f4-a5b6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  brand?: any;

  // Supports price range: price[gte], price[lte]
  @ApiPropertyOptional({
    type: Object,
    description:
      'Price range object or bracket query (price[gte], price[lte]) in EGP',
    example: { gte: 200, lte: 1000 },
  })
  @IsOptional()
  price?: any;
}
