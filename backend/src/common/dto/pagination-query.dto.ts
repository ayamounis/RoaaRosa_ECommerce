import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Page index',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Items count per page',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    type: String,
    description: 'Sorting criteria string',
    example: '-createdAt',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Full-text keyword filter',
    example: 'cotton',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
