import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryUserDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user role (USER or ADMIN)',
    required: false,
    example: 'USER',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
