import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty({ description: 'Full name of the sender', example: 'Laila Ahmed' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ description: 'Sender email address', example: 'laila@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({ description: 'Optional phone number', example: '+201012345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ description: 'Message subject / topic', example: 'Inquiry regarding dresses custom sizing' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  subject!: string;

  @ApiProperty({ description: 'Detailed inquiry message', example: 'Hello, I want to inquire about availability of size 6 in the velvet gown.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(3000)
  message!: string;
}
