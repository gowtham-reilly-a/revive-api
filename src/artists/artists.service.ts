import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createReadStream } from 'fs';
import { Model } from 'mongoose';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CloudinaryFactory } from 'src/cloudinary/cloudinary-factory';
import { ActionEnum } from 'src/global/enums/action.enum';
import { SubjectEnum } from 'src/global/enums/subject.enum';
import { UserDocument } from 'src/users/user.model';
import { Artist, ArtistDocument } from './artist.model';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name) private artistsModel: Model<ArtistDocument>,
    private caslAbilityFactory: CaslAbilityFactory,
    private cloudinaryFactory: CloudinaryFactory,
  ) {}

  async createArtist(
    currentUser: UserDocument,
    createArtistDto: CreateArtistDto,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Create, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to create an artist",
      );

    return this.artistsModel.create(createArtistDto);
  }

  async getArtist(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to view the artist",
      );

    return this.artistsModel.findById(id);
  }

  async getSeveralArtists(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to view artists",
      );

    const ids = query.split(',');

    const artists = await this.artistsModel.find().where('id').in(ids).exec();

    return artists.filter((artist) => ability.can(ActionEnum.Read, artist));
  }

  async updateArtist(
    currentUser: UserDocument,
    id: string,
    updateUserDto: UpdateArtistDto,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to update an artist",
      );

    const artist = await this.artistsModel.findById(id);

    if (!artist) throw new NotFoundException('Artist not found');

    if (ability.cannot(ActionEnum.Update, artist))
      throw new UnauthorizedException(
        "You don't have permission to update this artist",
      );

    return artist.update(updateUserDto, { new: true });
  }

  async updateArtistImage(
    currentUser: UserDocument,
    id: string,
    image: Express.Multer.File,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to update an artist",
      );

    const artist = await this.artistsModel.findById(id);

    if (!artist) throw new NotFoundException('Artist not found');

    if (ability.cannot(ActionEnum.Update, artist))
      throw new UnauthorizedException(
        "You don't have permission to update this artist",
      );

    const { secure_url } = await this.cloudinaryFactory.uploadStream(
      image.buffer,
      {
        folder: 'artist',
        resource_type: 'image',
        public_id: artist.id,
        overwrite: true,
        format: image.mimetype.split('/')[1],
      },
    );

    return this.artistsModel.findByIdAndUpdate(
      id,
      { image: secure_url },
      { new: true },
    );
  }

  async deleteArtist(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to delete an artist",
      );

    const artist = await this.artistsModel.findById(id);

    if (!artist) throw new NotFoundException('Artist not found');

    if (ability.cannot(ActionEnum.Delete, artist))
      throw new UnauthorizedException(
        "You don't have permission to delete this artist",
      );

    return artist.delete();
  }

  async deleteSeveralArtists(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to delete an artist",
      );

    const ids = query.split(',');

    const artists = await this.artistsModel.find().where('id').in(ids).exec();

    if (!artists.length) throw new NotFoundException('Artists not found');

    const allowedToDelete = artists.filter((artist) =>
      ability.can(ActionEnum.Delete, artist),
    );

    if (!allowedToDelete.length)
      throw new UnauthorizedException(
        "You don't have permission to delete these artists",
      );

    return this.artistsModel
      .deleteMany()
      .where('id')
      .in(allowedToDelete)
      .exec();
  }
}
