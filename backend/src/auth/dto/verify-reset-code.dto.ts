import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetCodeDto {
  @ApiProperty({
    type: String,
    description: '6-digit verification code received by email',
    example: '482915',
  })
  @IsNotEmpty({ message: 'Reset code is required' })
  @IsString()
  resetCode: string;
}
