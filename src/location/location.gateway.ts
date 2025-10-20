import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: true })
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(private usersService: UsersService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    
    if (userId) {
      this.userSockets.set(userId, client.id);
      await this.usersService.updateOnlineStatus(userId, true);
      
      this.server.emit('userOnline', { userId, isOnline: true });
      console.log(`Usuario conectado: ${userId}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries())
      .find(([, socketId]) => socketId === client.id)?.[0];
    
    if (userId) {
      this.userSockets.delete(userId);
      await this.usersService.updateOnlineStatus(userId, false);
      
      this.server.emit('userOffline', { userId, isOnline: false });
      console.log(`Usuario desconectado: ${userId}`);
    }
  }

  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; latitude: number; longitude: number },
  ) {
    const { userId, latitude, longitude } = data;
    
    await this.usersService.updateLocation(userId, { latitude, longitude });
    
    // Notificar a todos los usuarios conectados sobre la actualización de ubicación
    this.server.emit('locationUpdated', {
      userId,
      latitude,
      longitude,
      timestamp: new Date(),
    });

    return { success: true };
  }

  @SubscribeMessage('requestNearbyUsers')
  async handleNearbyUsersRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; maxDistance?: number },
  ) {
    const nearbyUsers = await this.usersService.getNearbyUsers(
      data.userId,
      data.maxDistance,
    );

    client.emit('nearbyUsers', nearbyUsers);
  }
}
