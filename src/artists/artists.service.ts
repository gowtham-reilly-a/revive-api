import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CloudinaryFactory } from 'src/cloudinary/cloudinary-factory';
import { ActionEnum } from 'src/global/enums/action.enum';
import { SubjectEnum } from 'src/global/enums/subject.enum';
import { UserDocument } from 'src/users/user.model';
import { useQueryFeatures } from 'src/utils/useQueryFeatures';
import { Artist, ArtistDocument } from './artist.model';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
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

    return await this.artistModel.create(createArtistDto);
  }

  async getArtist(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to view the artist",
      );

    const artist = await this.artistModel.findById(id);

    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  async getSeveralArtists(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to view artists",
      );

    if (!query) throw new BadRequestException('Missing ids in query');

    const ids = query?.split(',');
    if (ids.length > 50)
      throw new BadRequestException('Application limit exceeded');

    return await this.artistModel.find({ _id: { $in: ids } });
  }

  async listArtists(
    currentUser: UserDocument,
    query: { [key: string]: string },
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to view artists",
      );

    const { query: q } = await useQueryFeatures(this.artistModel, query);

    return await q;
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

    const artist = await this.artistModel.findById(id);

    if (!artist) throw new NotFoundException('Artist not found');

    return await this.artistModel.findByIdAndUpdate(artist.id, updateUserDto, {
      new: true,
    });
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

    const artist = await this.artistModel.findById(id);

    if (!artist) throw new NotFoundException('Artist not found');

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

    return await this.artistModel.findByIdAndUpdate(
      artist.id,
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

    const artist = await this.artistModel.findById(id).select('_id');

    if (!artist) throw new NotFoundException('Artist not found');

    return await this.artistModel.findByIdAndDelete(artist.id);
  }

  async deleteSeveralArtists(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Artist))
      throw new UnauthorizedException(
        "You don't have permission to delete an artist",
      );

    if (!query) throw new BadRequestException('Provide ids in query');

    const ids = query.split(',');

    if (ids.length > 20)
      throw new BadRequestException('Application limit exceeded');

    const artists = await this.artistModel
      .find({ _id: { $in: ids } })
      .select('_id');

    if (!artists.length) throw new NotFoundException('Artists not found');

    return await this.artistModel.deleteMany({
      _id: { $in: artists.map((artist) => artist.id) },
    });
  }
}
