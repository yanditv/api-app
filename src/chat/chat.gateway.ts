import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();
  private typingUsers = new Map<string, Set<string>>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`Chat - Usuario conectado: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries())
      .find(([, socketId]) => socketId === client.id)?.[0];
    
    if (userId) {
      this.userSockets.delete(userId);
      
      // Limpiar estados de "escribiendo"
      this.typingUsers.forEach((users, conversationId) => {
        if (users.has(userId)) {
          users.delete(userId);
          this.server.to(conversationId).emit('userStoppedTyping', { userId, conversationId });
        }
      });
      
      console.log(`Chat - Usuario desconectado: ${userId}`);
    }
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(data.conversationId);
    return { success: true };
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(data.conversationId);
    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; conversationId: string; content: string; type?: string; mediaUrls?: string[] },
  ) {
    const message = await this.chatService.sendMessage(data.userId, {
      conversationId: data.conversationId,
      content: data.content,
      type: data.type as any,
      mediaUrls: data.mediaUrls,
    });

    // Enviar mensaje a todos los participantes de la conversación
    this.server.to(data.conversationId).emit('newMessage', message);

    return { success: true, message };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; conversationId: string; isTyping: boolean },
  ) {
    const { userId, conversationId, isTyping } = data;

    if (!this.typingUsers.has(conversationId)) {
      this.typingUsers.set(conversationId, new Set());
    }

    const typingSet = this.typingUsers.get(conversationId);

    if (isTyping) {
      typingSet.add(userId);
      this.server.to(conversationId).emit('userTyping', { userId, conversationId });
    } else {
      typingSet.delete(userId);
      this.server.to(conversationId).emit('userStoppedTyping', { userId, conversationId });
    }

    return { success: true };
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; conversationId: string },
  ) {
    await this.chatService.markMessagesAsRead(data.userId, data.conversationId);
    
    this.server.to(data.conversationId).emit('messagesRead', {
      userId: data.userId,
      conversationId: data.conversationId,
    });

    return { success: true };
  }
}
