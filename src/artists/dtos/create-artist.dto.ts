import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArtistDto {
  @IsObject()
  @IsOptional()
  external_urls?: {
    [key: string]: string;
  };

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;
}
