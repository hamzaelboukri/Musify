import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  artist: string;

  @IsString()
  @IsNotEmpty()
  singerId: string;

  @IsString()
  @IsOptional()
  album?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @IsNumber()
  duration: number;
}
