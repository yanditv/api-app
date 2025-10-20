import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createPost(userId: string, dto: CreatePostDto): Promise<Post> {
    const post = new this.postModel({
      authorId: new Types.ObjectId(userId),
      content: dto.content,
      mediaUrls: dto.mediaUrls || [],
      location: dto.location,
    });

    return post.save();
  }

  async getFeed(userId: string, limit: number = 20, skip: number = 0): Promise<Post[]> {
    return this.postModel
      .find({ isDeleted: false })
      .populate('authorId', '-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getPostById(postId: string): Promise<Post> {
    const post = await this.postModel
      .findOne({ _id: postId, isDeleted: false })
      .populate('authorId', '-password')
      .exec();

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    return post;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.postModel
      .find({ authorId: new Types.ObjectId(userId), isDeleted: false })
      .populate('authorId', '-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updatePost(postId: string, userId: string, dto: Partial<CreatePostDto>): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    if (post.authorId.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para editar este post');
    }

    Object.assign(post, dto);
    return post.save();
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    if (post.authorId.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este post');
    }

    post.isDeleted = true;
    await post.save();
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    const userObjectId = new Types.ObjectId(userId);
    const likeIndex = post.likes.findIndex(id => id.toString() === userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userObjectId);
    }

    return post.save();
  }

  async createComment(postId: string, userId: string, dto: CreateCommentDto): Promise<Comment> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    const comment = new this.commentModel({
      postId: new Types.ObjectId(postId),
      authorId: new Types.ObjectId(userId),
      content: dto.content,
      parentCommentId: dto.parentCommentId ? new Types.ObjectId(dto.parentCommentId) : undefined,
    });

    await comment.save();

    post.commentsCount += 1;
    await post.save();

    return comment;
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ postId: new Types.ObjectId(postId), isDeleted: false })
      .populate('authorId', '-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  async toggleCommentLike(commentId: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    const userObjectId = new Types.ObjectId(userId);
    const likeIndex = comment.likes.findIndex(id => id.toString() === userId);

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(userObjectId);
    }

    return comment.save();
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este comentario');
    }

    comment.isDeleted = true;
    await comment.save();

    const post = await this.postModel.findById(comment.postId);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }
  }
}
