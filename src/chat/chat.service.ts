import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createConversation(userId: string, dto: CreateConversationDto): Promise<Conversation> {
    const participants = [new Types.ObjectId(userId), ...dto.participantIds.map(id => new Types.ObjectId(id))];
    
    // Verificar si ya existe una conversación con estos participantes
    if (!dto.isGroup && participants.length === 2) {
      const existing = await this.conversationModel.findOne({
        participants: { $all: participants, $size: 2 },
        isGroup: false,
      });
      
      if (existing) {
        return existing;
      }
    }

    const conversation = new this.conversationModel({
      participants,
      isGroup: dto.isGroup || false,
      groupName: dto.groupName,
      unreadCount: {},
    });

    return conversation.save();
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel
      .find({ participants: new Types.ObjectId(userId) })
      .populate('participants', '-password')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async sendMessage(userId: string, dto: SendMessageDto): Promise<Message> {
    const conversation = await this.conversationModel.findById(dto.conversationId);
    
    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    const message = new this.messageModel({
      conversationId: new Types.ObjectId(dto.conversationId),
      senderId: new Types.ObjectId(userId),
      content: dto.content,
      type: dto.type || 'text',
      mediaUrls: dto.mediaUrls || [],
      readBy: [new Types.ObjectId(userId)],
    });

    const savedMessage = await message.save();

    // Actualizar última mensaje y contador de no leídos
    conversation.lastMessage = savedMessage._id as Types.ObjectId;
    
    const unreadCount = conversation.unreadCount || new Map();
    conversation.participants.forEach(participantId => {
      const id = participantId.toString();
      if (id !== userId) {
        const current = unreadCount.get(id) || 0;
        unreadCount.set(id, current + 1);
      }
    });
    conversation.unreadCount = unreadCount;

    await conversation.save();

    return savedMessage;
  }

  async getConversationMessages(conversationId: string, limit: number = 50, skip: number = 0): Promise<Message[]> {
    return this.messageModel
      .find({ conversationId: new Types.ObjectId(conversationId), isDeleted: false })
      .populate('senderId', '-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async markMessagesAsRead(userId: string, conversationId: string): Promise<void> {
    const conversation = await this.conversationModel.findById(conversationId);
    
    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    await this.messageModel.updateMany(
      {
        conversationId: new Types.ObjectId(conversationId),
        senderId: { $ne: new Types.ObjectId(userId) },
        readBy: { $ne: new Types.ObjectId(userId) },
      },
      { $addToSet: { readBy: new Types.ObjectId(userId) } },
    );

    // Resetear contador de no leídos
    const unreadCount = conversation.unreadCount || new Map();
    unreadCount.set(userId, 0);
    conversation.unreadCount = unreadCount;
    await conversation.save();
  }

  async deleteMessage(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageModel.findById(messageId);
    
    if (!message) {
      throw new NotFoundException('Mensaje no encontrado');
    }

    if (message.senderId.toString() !== userId) {
      throw new NotFoundException('No tienes permiso para eliminar este mensaje');
    }

    message.isDeleted = true;
    return message.save();
  }
}
