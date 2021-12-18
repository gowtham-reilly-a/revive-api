import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  title?: string;

  @IsArray()
  @IsOptional()
  artists?: string[];

  @IsDate()
  @IsOptional()
  releasedAt?: Date;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;
}
