import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: -2.9001 })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ example: -79.0059 })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
