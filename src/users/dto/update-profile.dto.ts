import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsDateString, 
  IsEnum, 
  IsArray, 
  IsUrl,
  ValidateNested,
  IsPhoneNumber
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialMediaDto {
  @ApiProperty({ required: false, example: 'https://facebook.com/usuario' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiProperty({ required: false, example: 'https://instagram.com/usuario' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiProperty({ required: false, example: 'https://twitter.com/usuario' })
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @ApiProperty({ required: false, example: 'https://linkedin.com/in/usuario' })
  @IsOptional()
  @IsUrl()
  linkedin?: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({ required: false, example: 'Desarrollador apasionado por la tecnología' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false, example: '+593987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: '1990-01-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ 
    required: false, 
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    example: 'male'
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other', 'prefer-not-to-say'])
  gender?: string;

  @ApiProperty({ required: false, example: 'Ingeniero de Software' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ required: false, example: 'Tech Solutions Inc.' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, example: 'https://miportfolio.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ 
    required: false, 
    type: [String],
    example: ['programación', 'viajes', 'fotografía']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiProperty({ required: false, type: SocialMediaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;

  @ApiProperty({ required: false, example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsUrl()
  coverPhoto?: string;
}
