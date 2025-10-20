import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  participantIds: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  groupName?: string;
}
