import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ShippingAddressDto {
  @ApiPropertyOptional({
    description: 'Detailed street address, building, and apartment number for clothing delivery',
    example: '15 Kasr El-Nil Street, Apartment 4B',
    type: String,
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({
    description: 'City or governorate for delivery',
    example: 'Cairo',
    type: String,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Egyptian contact phone number for delivery driver',
    example: '01012345678',
    type: String,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Egyptian postal code for delivery area',
    example: '11511',
    type: String,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional({
    description: 'Structured shipping address for clothing delivery',
    type: () => ShippingAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress?: ShippingAddressDto;

  @ApiPropertyOptional({
    description: 'Flat fallback: Detailed street address, building, and apartment number',
    example: '15 Kasr El-Nil Street, Apartment 4B',
    type: String,
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({
    description: 'Flat fallback: City or governorate for delivery',
    example: 'Cairo',
    type: String,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Flat fallback: Egyptian contact phone number for courier',
    example: '01012345678',
    type: String,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Flat fallback: Egyptian postal code',
    example: '11511',
    type: String,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Optional discount coupon code to apply at checkout',
    example: 'SUMMER25',
    type: String,
  })
  @IsOptional()
  @IsString()
  coupon?: string;
}
