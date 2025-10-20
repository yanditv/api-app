import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo post' })
  async createPost(@Request() req, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(req.user.userId, dto);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Obtener feed de posts' })
  async getFeed(
    @Request() req,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    return this.postsService.getFeed(req.user.userId, limit, skip);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener posts de un usuario' })
  async getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener post por ID' })
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar post' })
  async updatePost(@Request() req, @Param('id') id: string, @Body() dto: Partial<CreatePostDto>) {
    return this.postsService.updatePost(id, req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar post' })
  async deletePost(@Request() req, @Param('id') id: string) {
    await this.postsService.deletePost(id, req.user.userId);
    return { success: true };
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Dar/quitar like a post' })
  async toggleLike(@Request() req, @Param('id') id: string) {
    return this.postsService.toggleLike(id, req.user.userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Crear comentario en post' })
  async createComment(@Request() req, @Param('id') postId: string, @Body() dto: CreateCommentDto) {
    return this.postsService.createComment(postId, req.user.userId, dto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Obtener comentarios de post' })
  async getPostComments(@Param('id') postId: string) {
    return this.postsService.getPostComments(postId);
  }

  @Post('comments/:id/like')
  @ApiOperation({ summary: 'Dar/quitar like a comentario' })
  async toggleCommentLike(@Request() req, @Param('id') commentId: string) {
    return this.postsService.toggleCommentLike(commentId, req.user.userId);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Eliminar comentario' })
  async deleteComment(@Request() req, @Param('id') commentId: string) {
    await this.postsService.deleteComment(commentId, req.user.userId);
    return { success: true };
  }
}
