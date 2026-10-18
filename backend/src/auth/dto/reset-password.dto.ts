import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    description: 'Email address of the account',
    example: 'mohamed.fares@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'New password for the account',
    example: 'NewSecurePass2026!',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;
}
