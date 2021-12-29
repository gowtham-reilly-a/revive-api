import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.model';
import { AlbumsService } from './albums.service';
import { AddAlbumTrackDto } from './dtos/add-album-track.dto';

@Controller('albums/:album_id/tracks')
export class AlbumTracksController {
  constructor(private albumsService: AlbumsService) {}

  @Post()
  addTrackToAlbum(
    @CurrentUser() currentUser: UserDocument,
    @Param('album_id') albumId: string,
    @Body() { trackId }: AddAlbumTrackDto,
  ) {
    return this.albumsService.addTrackToAlbum(currentUser, albumId, trackId);
  }

  @Delete(':track_id')
  removeTrackFromAlbum(
    @CurrentUser() currentUser: UserDocument,
    @Param('album_id') albumId: string,
    @Param('track_id') trackId: string,
  ) {
    return this.albumsService.removeTrackFromAlbum(
      currentUser,
      albumId,
      trackId,
    );
  }
}
