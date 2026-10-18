import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Address label or alias',
    example: 'Home',
  })
  @IsOptional()
  @IsString()
  alias?: string;

  // Frontend compatibility: sometimes sends 'name' instead of 'alias'
  @ApiPropertyOptional({
    type: String,
    description: 'Frontend alternative label name',
    example: 'Work Office',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: String,
    description: 'Detailed street address, building, floor, apartment',
    example: '15 El-Tahrir Street, Floor 4, Apt 4B',
  })
  @IsNotEmpty({ message: 'Address details are required' })
  @IsString()
  details: string;

  @ApiProperty({
    type: String,
    description: 'Delivery contact phone number',
    example: '+201000000002',
  })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
    description: 'City / Governorate name in Egypt',
    example: 'Cairo',
  })
  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  city: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Postal / ZIP code',
    example: '11511',
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether to set as primary default shipping address',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
