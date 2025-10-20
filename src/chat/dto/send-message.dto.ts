import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { MessageType } from '../schemas/message.schema';

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ enum: MessageType, default: MessageType.TEXT })
  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  mediaUrls?: string[];
}
