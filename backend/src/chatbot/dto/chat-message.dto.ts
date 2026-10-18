import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({
    type: String,
    description: 'Customer message',
    example: 'Do you have summer dresses?',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional session identifier for conversation tracking',
    example: 'session_abc123',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
