import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const user = await this.usersService.create(createUserDto);
    const payload = { email: user.email, sub: user['_id'].toString() };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user['_id'].toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.usersService.updateOnlineStatus(user._id.toString(), true);

    const payload = { email: user.email, sub: user._id.toString() };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isOnline: true,
      },
    };
  }

  async logout(userId: string) {
    await this.usersService.updateOnlineStatus(userId, false);
    return { message: 'Sesión cerrada exitosamente' };
  }
}
