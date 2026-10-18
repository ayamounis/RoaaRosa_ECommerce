import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    type: String,
    description: 'Full name of the customer',
    example: 'Mohamed Fares',
    minLength: 3,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Customer email address',
    example: 'mohamed.fares@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Account password (minimum 6 characters)',
    example: 'SecurePass123!',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    type: String,
    description: 'Password confirmation (must match password)',
    example: 'SecurePass123!',
  })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @IsString()
  rePassword: string;

  @ApiProperty({
    type: String,
    description: 'Egyptian mobile phone number',
    example: '+201012345678',
  })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString()
  phone: string;
}
