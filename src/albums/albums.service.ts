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
import { useQueryFeatures } from 'src/utils/useQueryFeatures';

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

    const album = await this.albumModel.create(createAlbumDto);

    return album.populate([
      {
        path: 'tracks',
        populate: { path: 'artists' },
      },
      {
        path: 'artists',
      },
    ]);
  }

  async getAlbum(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to read a album');

    const album = await this.albumModel.findById(id);

    if (!album) throw new NotFoundException('Album not found');

    return album.populate([
      {
        path: 'tracks',
        populate: { path: 'artists' },
      },
      {
        path: 'artists',
      },
    ]);
  }

  async getSeveralAlbums(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to read a album');

    if (!query) throw new BadRequestException('Provide ids in query');

    const ids = query.split(',');

    if (ids.length > 50) throw new BadRequestException('App limit exceeded');

    return this.albumModel
      .find()
      .where('_id')
      .in(ids)
      .populate([
        {
          path: 'tracks',
          populate: { path: 'artists' },
        },
        {
          path: 'artists',
        },
      ])
      .exec();
  }

  async listAlbums(
    currentUser: UserDocument,
    query: { [key: string]: string },
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to read a album');

    const { query: q } = await useQueryFeatures(this.albumModel, query);

    return await q.populate([
      {
        path: 'tracks',
        populate: { path: 'artists' },
      },
      {
        path: 'artists',
      },
    ]);
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

    return await this.albumModel
      .findByIdAndUpdate(album.id, updateAlbumDto, {
        new: true,
      })
      .populate([
        {
          path: 'tracks',
          populate: { path: 'artists' },
        },
        {
          path: 'artists',
        },
      ]);
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

    return this.albumModel
      .findByIdAndUpdate(id, { image: secure_url }, { new: true })
      .populate([
        {
          path: 'tracks',
          populate: { path: 'artists' },
        },
        {
          path: 'artists',
        },
      ]);
  }

  async deleteAlbum(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to delete a album');

    const album = await this.albumModel.findById(id);

    return await album.deleteOne();
  }

  async deleteSeveralAlbums(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to delete a album');

    if (!query) throw new BadRequestException('Provide ids in query');

    const ids = query.split(',');

    if (ids.length > 20) throw new BadRequestException('App limit exceeded');

    return this.albumModel.deleteMany().where('_id').in(ids).exec();
  }

  async addArtistToAlbum(
    currentUser: UserDocument,
    albumId: string,
    artistId: string,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to update a album');

    const album = await this.albumModel.findById(albumId);

    const isExist = album.artists.some((artist) => artist === artistId);

    if (isExist) throw new BadRequestException('Artist already exist');

    album.artists.push(artistId);

    await album.save();

    return album.populate([
      {
        path: 'tracks',
        populate: { path: 'artists' },
      },
      {
        path: 'artists',
      },
    ]);
  }

  async removeArtistFromAlbum(
    currentUser: UserDocument,
    albumId: string,
    artistId: string,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to update a album');

    const album = await this.albumModel.findById(albumId);

    const isExist = album.artists.some((artist) => artist === artistId);
    if (!isExist)
      throw new NotFoundException('Artist does not exist on this album');

    const artists = album.artists.filter((artist) => artist !== artistId);

    album.artists = artists;

    return await album.save();
  }

  async addTrackToAlbum(
    currentUser: UserDocument,
    albumId: string,
    trackId: string,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to update a album');

    const album = await this.albumModel.findById(albumId);

    const isExist = album.tracks.some((track) => track === trackId);

    if (isExist) throw new BadRequestException('Track already exist');

    album.tracks.push(trackId);

    await album.save();

    return album.populate([
      {
        path: 'tracks',
        populate: { path: 'artists' },
      },
      {
        path: 'artists',
      },
    ]);
  }

  async removeTrackFromAlbum(
    currentUser: UserDocument,
    albumId: string,
    trackId: string,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Album))
      throw new UnauthorizedException('You are not allowed to update a album');

    const album = await this.albumModel.findById(albumId);

    const isExist = album.tracks.some((track) => track === trackId);
    if (!isExist)
      throw new NotFoundException('Track does not exist on this album');

    const tracks = album.tracks.filter((track) => track !== trackId);

    album.tracks = tracks;

    return await album.save();
  }
}
