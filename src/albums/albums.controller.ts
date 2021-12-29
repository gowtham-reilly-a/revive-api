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
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.model';
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';
import { AlbumsService } from './albums.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Post()
  createAlbum(
    @CurrentUser() currentUser: UserDocument,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    return this.albumsService.createAlbum(currentUser, createAlbumDto);
  }

  @Get(':id')
  getAlbum(@CurrentUser() currentUser: UserDocument, @Param('id') id: string) {
    return this.albumsService.getAlbum(currentUser, id);
  }

  @Get()
  getSeveralAlbums(
    @CurrentUser() currentUser: UserDocument,
    @Query() query: { [key: string]: string },
  ) {
    const { ids, ...listQuery } = query;

    if (ids) return this.albumsService.getSeveralAlbums(currentUser, ids);

    return this.albumsService.listAlbums(currentUser, listQuery);
  }

  @Patch(':id')
  updateAlbum(
    @CurrentUser() currentUser: UserDocument,
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumsService.updateAlbum(currentUser, id, updateAlbumDto);
  }

  @Delete(':id')
  deleteAlbum(
    @CurrentUser() currentUser: UserDocument,
    @Param('id') id: string,
  ) {
    return this.albumsService.deleteAlbum(currentUser, id);
  }

  @Delete()
  deleteSeveralAlbums(
    @CurrentUser() currentUser: UserDocument,
    @Query('ids') ids: string,
  ) {
    return this.albumsService.deleteSeveralAlbums(currentUser, ids);
  }

  @Put(':album_id/images')
  @UseInterceptors(FileInterceptor('album_image'))
  updateAlbumImage(
    @CurrentUser() currentUser: UserDocument,
    @Param('album_id') albumId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.albumsService.updateAlbumImage(currentUser, albumId, image);
  }
}
