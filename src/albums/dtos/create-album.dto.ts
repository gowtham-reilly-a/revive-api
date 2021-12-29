import {
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AlbumTypeEnum } from '../enums/album-type.enum';

export class CreateAlbumDto {
  @IsString()
  @IsEnum(AlbumTypeEnum)
  album_type: AlbumTypeEnum;

  @IsObject()
  @IsOptional()
  external_urls?: {
    [key: string]: string;
  };

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsDateString()
  release_date: Date;
}
