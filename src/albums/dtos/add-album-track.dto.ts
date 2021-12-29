import { IsString } from 'class-validator';

export class AddAlbumTrackDto {
  @IsString()
  trackId: string;
}
