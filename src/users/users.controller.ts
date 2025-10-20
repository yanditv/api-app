import { Controller, Get, Param, UseGuards, Request, Put, Body, Query, Patch, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('profile/avatar')
  @ApiOperation({ summary: 'Subir avatar y actualizar perfil' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó archivo');
    }

    // Subir imagen usando UploadService
    const url = await this.uploadService.uploadImage(file);

    // Actualizar profile del usuario con la URL
    return this.usersService.updateProfile(req.user.userId, { avatar: url } as any);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar perfil del usuario actual' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Obtener perfil público por ID' })
  async getProfileById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Obtener usuarios cercanos' })
  async getNearbyUsers(
    @Request() req,
    @Query('maxDistance') maxDistance?: number,
  ) {
    return this.usersService.getNearbyUsers(req.user.userId, maxDistance);
  }

  @Put('location')
  @ApiOperation({ summary: 'Actualizar ubicación del usuario' })
  async updateLocation(@Request() req, @Body() locationDto: UpdateLocationDto) {
    return this.usersService.updateLocation(req.user.userId, locationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
