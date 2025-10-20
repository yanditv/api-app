import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { isOnline, lastSeen: new Date() },
      { new: true },
    ).select('-password').exec();
  }

  async updateLocation(userId: string, locationDto: UpdateLocationDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        location: {
          ...locationDto,
          updatedAt: new Date(),
        },
      },
      { new: true },
    ).select('-password').exec();
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el perfil se completa por primera vez
    const isProfileComplete = !!(
      updateProfileDto.avatar &&
      updateProfileDto.bio &&
      updateProfileDto.phone &&
      updateProfileDto.dateOfBirth
    );

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...updateProfileDto,
        profileCompleted: isProfileComplete || user.profileCompleted,
      },
      { new: true },
    ).select('-password').exec();

    return updatedUser;
  }

  async getNearbyUsers(userId: string, maxDistance: number = 5000): Promise<User[]> {
    const user = await this.findById(userId);
    
    if (!user.location) {
      return [];
    }

    const allUsers = await this.userModel.find({
      _id: { $ne: userId },
      location: { $exists: true },
    }).select('-password').exec();

    return allUsers.filter(u => {
      const distance = this.calculateDistance(
        user.location.latitude,
        user.location.longitude,
        u.location.latitude,
        u.location.longitude,
      );
      return distance <= maxDistance;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }
}
