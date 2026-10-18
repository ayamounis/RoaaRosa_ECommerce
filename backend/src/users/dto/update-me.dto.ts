import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMeDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Updated customer full name',
    example: 'Mohamed Fares Updated',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Updated unique email address',
    example: 'mohamed.updated@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Updated mobile phone number',
    example: '+201099887766',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
