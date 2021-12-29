import { IsString } from 'class-validator';

export class AddTrackArtistDto {
  @IsString()
  artistId: string;
}
