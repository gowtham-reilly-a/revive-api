import {
  IsArray,
  IsDate,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsArray()
  artists: string[];

  @IsDate()
  releasedAt: Date;

  @IsString()
  tag: string;

  @IsString()
  coverImage: string;
}
