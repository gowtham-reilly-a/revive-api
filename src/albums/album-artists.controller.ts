import { Controller, Post, Get, Put, Delete, Param } from '@nestjs/common';

@Controller('albums/:album_id/artists')
export class AlbumArtistsController {
  @Post()
  addArtistsToAlbum(@Param('album_id') albumId: string) {
    console.log(albumId);
    return 'Album artists';
  }

  @Get()
  getSeveralArtistsOfAlbum(@Param('album_id') albumId: string) {
    console.log(albumId);
    return 'Album artists';
  }

  @Get()
  listArtistsOfAlbum(@Param('album_id') albumId: string) {
    console.log(albumId);
    return 'Album artists';
  }

  @Get(':artist_id')
  getArtistOfAlbum(
    @Param('album_id') albumId: string,
    @Param('artist_id') artistId: string,
  ) {
    console.log({ albumId, artistId });
    return 'Album artists';
  }

  @Put()
  updateArtistsOfAlbum(@Param('album_id') albumId: string) {
    console.log(albumId);
    return 'Album artists';
  }

  @Delete(':artist_id')
  deleteArtistOfAlbum(
    @Param('album_id') albumId: string,
    @Param('artist_id') artistId: string,
  ) {
    console.log({ albumId, artistId });
    return 'Album artists';
  }
}
