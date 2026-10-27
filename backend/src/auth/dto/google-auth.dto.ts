import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({
    type: String,
    description: 'Customer Gmail or Google account email address',
    example: 'customer@gmail.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Customer full name from Google profile',
    example: 'Sarah Ahmed',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional Google User ID / Provider ID',
    example: '10982347291847129',
  })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional mobile phone number',
    example: '01012345678',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
