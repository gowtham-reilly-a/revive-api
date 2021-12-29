import { IsArray, IsString } from 'class-validator';

export class UpdateTrackArtistsDto {
  @IsArray()
  @IsString({ each: true })
  artists: string[];
}
