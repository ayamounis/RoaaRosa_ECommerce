import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartQuantityDto {
  @ApiProperty({
    type: Number,
    description: 'Updated item quantity in cart (setting 0 removes item)',
    example: 3,
    minimum: 0,
  })
  @IsInt()
  @Min(0, { message: 'count cannot be negative' })
  count: number;
}
