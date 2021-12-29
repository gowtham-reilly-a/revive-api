import {
  IsArray,
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AlbumTypeEnum } from '../enums/album-type.enum';

export class UpdateAlbumDto {
  @IsString()
  @IsEnum(AlbumTypeEnum)
  @IsOptional()
  album_type: AlbumTypeEnum;

  @IsObject()
  @IsOptional()
  external_urls?: {
    [key: string]: string;
  };

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name: string;

  @IsDate()
  @IsOptional()
  release_date: Date;
}
