import { Controller, Post, Get, Put, Delete, Param } from '@nestjs/common';

@Controller('tracks/:track_id/artists')
export class TrackArtistsController {
  @Post()
  addArtistsToTrack(@Param('track_id') trackId: string) {
    console.log(trackId);
    return 'track artists';
  }

  @Get()
  getSeveralArtistsOfTrack(@Param('track_id') trackId: string) {
    console.log(trackId);
    return 'track artists';
  }

  @Get()
  listArtistsOfTrack(@Param('track_id') trackId: string) {
    console.log(trackId);
    return 'track artists';
  }

  @Get(':artist_id')
  getArtistOfTrack(
    @Param('track_id') trackId: string,
    @Param('artist_id') artistId: string,
  ) {
    console.log({ trackId, artistId });
    return 'track artists';
  }

  @Put()
  updateArtistsOfTrack(@Param('track_id') trackId: string) {
    console.log(trackId);
    return 'track artists';
  }

  @Delete(':artist_id')
  deleteArtistOfTrack(
    @Param('track_id') trackId: string,
    @Param('artist_id') artistId: string,
  ) {
    console.log({ trackId, artistId });
    return 'track artists';
  }
}
