import { IsString } from 'class-validator';

export class AddAlbumArtistDto {
  @IsString()
  artistId: string;
}
