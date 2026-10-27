import { IsEmail, IsOptional, IsString, MinLength, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Full name of the user',
    example: 'Aya Ahmed Updated',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'User email address',
    example: 'aya.updated@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'New password (optional, minimum 6 characters)',
    example: 'NewSecret123!',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Mobile phone number',
    example: '+201012345678',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    enum: Role,
    description: 'Role of the user (USER or ADMIN)',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either USER or ADMIN' })
  role?: Role;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Account activation status',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
