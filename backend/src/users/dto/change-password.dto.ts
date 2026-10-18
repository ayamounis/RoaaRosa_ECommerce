import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    description: 'Current password for verification',
    example: 'SecurePass123!',
  })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    type: String,
    description: 'New password',
    example: 'NewPass2026!',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    type: String,
    description: 'New password confirmation',
    example: 'NewPass2026!',
  })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @IsString()
  rePassword: string;
}
