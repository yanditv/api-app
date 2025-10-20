import { Controller, Get, Post, Body, Param, Query, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Crear nueva conversación' })
  async createConversation(@Request() req, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(req.user.userId, dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Obtener conversaciones del usuario' })
  async getUserConversations(@Request() req) {
    return this.chatService.getUserConversations(req.user.userId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Obtener mensajes de una conversación' })
  async getConversationMessages(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    return this.chatService.getConversationMessages(id, limit, skip);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Enviar mensaje (alternativa HTTP)' })
  async sendMessage(@Request() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.userId, dto);
  }

  @Post('conversations/:id/read')
  @ApiOperation({ summary: 'Marcar mensajes como leídos' })
  async markAsRead(@Request() req, @Param('id') conversationId: string) {
    await this.chatService.markMessagesAsRead(req.user.userId, conversationId);
    return { success: true };
  }

  @Delete('messages/:id')
  @ApiOperation({ summary: 'Eliminar mensaje' })
  async deleteMessage(@Request() req, @Param('id') messageId: string) {
    return this.chatService.deleteMessage(messageId, req.user.userId);
  }
}
