import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.model';
import { AddTrackArtistDto } from './dtos/add-track-artist.dto';
import { TracksService } from './tracks.service';

@Controller('tracks/:track_id/artists')
export class TrackArtistsController {
  constructor(private tracksService: TracksService) {}

  @Post()
  addArtistToTrack(
    @CurrentUser() currentUser: UserDocument,
    @Param('track_id') trackId: string,
    @Body() { artistId }: AddTrackArtistDto,
  ) {
    return this.tracksService.addArtistToTrack(currentUser, trackId, artistId);
  }

  @Delete(':artist_id')
  removeArtistFromTrack(
    @CurrentUser() currentUser: UserDocument,
    @Param('track_id') trackId: string,
    @Param('artist_id') artistId: string,
  ) {
    return this.tracksService.removeArtistFromTrack(
      currentUser,
      trackId,
      artistId,
    );
  }
}
