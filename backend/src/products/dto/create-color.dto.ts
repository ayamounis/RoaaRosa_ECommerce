import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColorDto {
  @ApiProperty({
    type: String,
    description: 'Color display name',
    example: 'Dusty Rose',
  })
  @IsNotEmpty({ message: 'Color name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Hexadecimal color code (e.g. #C48D80)',
    example: '#C48D80',
  })
  @IsNotEmpty({ message: 'Hex code is required' })
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'hexCode must be a valid hex color string (e.g. #C48D80)',
  })
  hexCode: string;
}
