import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  async uploadImage(file: Express.Multer.File): Promise<string> {
    await this.ensureUploadDir();

    const filename = `${uuidv4()}.webp`;
    const filepath = join(this.uploadPath, filename);

    // Optimizar imagen con sharp
    await sharp(file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    return `/uploads/${filename}`;
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    await this.ensureUploadDir();

    const filename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
    const filepath = join(this.uploadPath, filename);

    await writeFile(filepath, file.buffer);

    return `/uploads/${filename}`;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    await this.ensureUploadDir();

    const filename = `${uuidv4()}-${file.originalname}`;
    const filepath = join(this.uploadPath, filename);

    await writeFile(filepath, file.buffer);

    return `/uploads/${filename}`;
  }

  private async ensureUploadDir() {
    if (!existsSync(this.uploadPath)) {
      await mkdir(this.uploadPath, { recursive: true });
    }
  }
}
