import { Controller, Post, Get, Put, Delete, Param } from '@nestjs/common';

@Controller('albums/:album_id/tracks')
export class AlbumTracksController {
  @Post()
  addTracksToAlbum(@Param('album_id') albumId: string) {
    console.log(albumId);
    return 'Album tracks';
  }

  @Get()
  getSeveralTracksOfAlbum(@Param('album_id') albumId: string) {
    console.log(albumId);
    return 'Album tracks';
  }

  @Get()
  listTracksOfAlbum(@Param('album_id') albumId: string) {
    console.log(albumId);
    return 'Album tracks';
  }

  @Get(':track_id')
  getTrackOfAlbum(
    @Param('album_id') albumId: string,
    @Param('track_id') trackId: string,
  ) {
    console.log({ albumId, trackId });
    return 'Album tracks';
  }

  @Put()
  updateTracksOfAlbum(@Param('album_id') albumId: string) {
    console.log(albumId);
    return 'Album tracks';
  }

  @Delete(':track_id')
  deleteTrackOfAlbum(
    @Param('album_id') albumId: string,
    @Param('track_id') trackId: string,
  ) {
    console.log({ albumId, trackId });
    return 'Album tracks';
  }
}
