import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.model';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackArtistsDto } from './dtos/update-track-artists.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';
import { TracksService } from './tracks.service';

@Controller('tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Post()
  createTrack(
    @CurrentUser() currentUser: UserDocument,
    @Body() createTrackDto: CreateTrackDto,
  ) {
    return this.tracksService.createTrack(currentUser, createTrackDto);
  }

  @Get(':id')
  getTrack(@CurrentUser() currentUser: UserDocument, @Param('id') id: string) {
    return this.tracksService.getTrack(currentUser, id);
  }

  @Get()
  getSeveralTracks(
    @CurrentUser() currentUser: UserDocument,
    @Query('ids') ids: string,
  ) {
    return this.tracksService.getSeveralTracks(currentUser, ids);
  }

  @Patch(':id')
  updateTrack(
    @CurrentUser() currentUser: UserDocument,
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.tracksService.updateTrack(currentUser, id, updateTrackDto);
  }

  @Delete(':id')
  deleteTrack(
    @CurrentUser() currentUser: UserDocument,
    @Param('id') id: string,
  ) {
    return this.tracksService.deleteTrack(currentUser, id);
  }

  @Delete()
  deleteSeveralTracks(
    @CurrentUser() currentUser: UserDocument,
    @Query('ids') ids: string,
  ) {
    return this.tracksService.deleteSeveralTracks(currentUser, ids);
  }

  @Put(':track_id/images')
  @UseInterceptors(FileInterceptor('track_image'))
  updateTrackImage(
    @CurrentUser() currentUser: UserDocument,
    @Param('track_id') trackId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.tracksService.updateTrackImage(currentUser, trackId, image);
  }
}
