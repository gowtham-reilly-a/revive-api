import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.model';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Post()
  createArtist(
    @CurrentUser() currentUser: UserDocument,
    @Body() createArtistDto: CreateArtistDto,
  ) {
    return this.artistsService.createArtist(currentUser, createArtistDto);
  }

  @Get(':id')
  getArtist(@CurrentUser() currentUser: UserDocument, @Param('id') id: string) {
    return this.artistsService.getArtist(currentUser, id);
  }

  @Get()
  getSeveralArtists(
    @CurrentUser() currentUser: UserDocument,
    @Query('ids') ids: string,
  ) {
    return this.artistsService.getSeveralArtists(currentUser, ids);
  }

  @Patch(':id')
  updateArtist(
    @CurrentUser() currentUser: UserDocument,
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistsService.updateArtist(currentUser, id, updateArtistDto);
  }

  @Delete(':id')
  deleteArtist(
    @CurrentUser() currentUser: UserDocument,
    @Param('id') id: string,
  ) {
    return this.artistsService.deleteArtist(currentUser, id);
  }

  @Delete()
  deleteSeveralArtists(
    @CurrentUser() currentUser: UserDocument,
    @Query('ids') ids: string,
  ) {
    return this.artistsService.deleteSeveralArtists(currentUser, ids);
  }

  @Put(':artist_id/images')
  @UseInterceptors(FileInterceptor('artist_image'))
  updateArtistImage(
    @CurrentUser() currentUser: UserDocument,
    @Param('artist_id') artistId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.artistsService.updateArtistImage(currentUser, artistId, image);
  }
}
