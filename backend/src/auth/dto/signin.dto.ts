import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @ApiProperty({
    type: String,
    description: 'Registered email address',
    example: 'mohamed.fares@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Account password',
    example: 'SecurePass123!',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
