import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyCouponDto {
  @ApiProperty({
    type: String,
    description: 'Promotional coupon code to apply to active cart',
    example: 'EID2026',
  })
  @IsNotEmpty({ message: 'coupon code is required' })
  @IsString()
  coupon: string;
}
