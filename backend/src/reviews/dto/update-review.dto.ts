import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Updated rating from 1 to 5 stars',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt({ message: 'rating must be an integer' })
  @Min(1, { message: 'rating must be between 1 and 5' })
  @Max(5, { message: 'rating must be between 1 and 5' })
  rating?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Updated review title',
    example: 'Updated: Great after machine wash',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Updated review comments',
    example: 'Held its shape nicely, collar stayed sharp after washing.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
