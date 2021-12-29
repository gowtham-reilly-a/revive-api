import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.model';
import { AlbumsService } from './albums.service';
import { AddAlbumArtistDto } from './dtos/add-album-artist.dto';

@Controller('albums/:album_id/artists')
export class AlbumArtistsController {
  constructor(private albumsService: AlbumsService) {}

  @Post()
  addArtistToAlbum(
    @CurrentUser() currentUser: UserDocument,
    @Param('album_id') albumId: string,
    @Body() { artistId }: AddAlbumArtistDto,
  ) {
    return this.albumsService.addArtistToAlbum(currentUser, albumId, artistId);
  }

  @Delete(':artist_id')
  removeArtistFromAlbum(
    @CurrentUser() currentUser: UserDocument,
    @Param('album_id') albumId: string,
    @Param('artist_id') artistId: string,
  ) {
    return this.albumsService.removeArtistFromAlbum(
      currentUser,
      albumId,
      artistId,
    );
  }
}
