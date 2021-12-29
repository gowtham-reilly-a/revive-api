import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ActionEnum } from 'src/global/enums/action.enum';
import { SubjectEnum } from 'src/global/enums/subject.enum';
import { UserDocument } from 'src/users/user.model';
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';
import { Album, AlbumDocument } from './album.model';
import { CloudinaryFactory } from 'src/cloudinary/cloudinary-factory';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private caslAbilityFactory: CaslAbilityFactory,
    private cloudinaryFactory: CloudinaryFactory,
  ) {}

  async createAlbum(currentUser: UserDocument, createAlbumDto: CreateAlbumDto) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Create, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to create a album');

    return await this.albumModel.create(createAlbumDto);
  }

  async getAlbum(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to read a album');

    const album = await this.albumModel.findById(id);

    if (ability.cannot(ActionEnum.Read, album))
      throw new UnauthorizedException('You are not allowed to read this album');

    return album;
  }

  async getSeveralAlbums(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to read a album');

    const ids = query.split(',');

    if (ids.length > 50) throw new BadRequestException('App limit exceeded');

    const albums = await this.albumModel.find().where('id').in(ids).exec();

    const allowedToRead = albums.filter((album) =>
      ability.can(ActionEnum.Read, album),
    );

    if (!allowedToRead.length)
      throw new UnauthorizedException(
        'You are not allowed to read these albums',
      );

    return allowedToRead;
  }

  async updateAlbum(
    currentUser: UserDocument,
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to update a album');

    const album = await this.albumModel.findById(id);

    if (!album) throw new NotFoundException('Album not found');

    if (ability.cannot(ActionEnum.Update, album))
      throw new UnauthorizedException(
        'You are not allowed to update this album',
      );

    return await this.albumModel.findByIdAndUpdate(album.id, updateAlbumDto, {
      new: true,
    });
  }

  async updateAlbumImage(
    currentUser: UserDocument,
    id: string,
    image: Express.Multer.File,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Album))
      throw new UnauthorizedException(
        "You don't have permission to update an album",
      );

    const album = await this.albumModel.findById(id);

    if (!album) throw new NotFoundException('Album not found');

    if (ability.cannot(ActionEnum.Update, album))
      throw new UnauthorizedException(
        "You don't have permission to update this album",
      );

    const { secure_url } = await this.cloudinaryFactory.uploadStream(
      image.buffer,
      {
        folder: 'album',
        resource_type: 'image',
        public_id: album.id,
        overwrite: true,
        format: image.mimetype.split('/')[1],
      },
    );

    return this.albumModel.findByIdAndUpdate(
      id,
      { image: secure_url },
      { new: true },
    );
  }

  async deleteAlbum(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to delete a album');

    const album = await this.albumModel.findById(id);

    if (ability.cannot(ActionEnum.Delete, album))
      throw new UnauthorizedException(
        'You are not allowed to delete this album',
      );

    return await album.deleteOne();
  }

  async deleteSeveralAlbums(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to delete a album');

    const ids = query.split(',');

    if (ids.length > 50) throw new BadRequestException('App limit exceeded');

    const albums = await this.albumModel.find().where('id').in(ids).exec();

    const allowedToDelete: AlbumDocument[] = albums.filter(
      (album: AlbumDocument): boolean => ability.can(ActionEnum.Delete, album),
    );

    if (!allowedToDelete.length)
      throw new UnauthorizedException(
        'You are not allowed to delete these albums',
      );

    return await this.albumModel
      .findByIdAndDelete()
      .where('id')
      .in(allowedToDelete.map((album) => album.id))
      .exec();
  }
}
