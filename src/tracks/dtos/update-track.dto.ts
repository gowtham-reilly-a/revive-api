import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateTrackDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  artists?: string[];

  @IsNumber()
  @IsPositive()
  @Min(1)
  @IsOptional()
  duration_ms?: number;

  @IsObject()
  @IsOptional()
  external_urls?: {
    [key: string]: string;
  };

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name?: string;
}
