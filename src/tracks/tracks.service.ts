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
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';
import { Track, TrackDocument } from './track.model';

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    private caslAbilityFactory: CaslAbilityFactory,
    private cloudinaryFactory: CloudinaryFactory,
  ) {}

  async createTrack(currentUser: UserDocument, createTrackDto: CreateTrackDto) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Create, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to create a track');

    return await this.trackModel.create(createTrackDto);
  }

  async getTrack(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to read a track');

    const track = await this.trackModel.findById(id).populate('artists');

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async getSeveralTracks(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to read a track');

    if (!query) throw new BadRequestException('No query provided');

    const ids = query.split(',');

    if (ids.length > 50) throw new BadRequestException('App limit exceeded');

    return await this.trackModel
      .find({ _id: { $in: ids } })
      .populate('artists');
  }

  async listTracks(
    currentUser: UserDocument,
    query: { [key: string]: string },
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to read a track');

    const { query: q } = await useQueryFeatures(this.trackModel, query);

    return await q.populate('artists');
  }

  async updateTrack(
    currentUser: UserDocument,
    id: string,
    updateTrackDto: UpdateTrackDto,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to update a track');

    const track = await this.trackModel.findById(id);

    if (!track) throw new NotFoundException('Track not found');

    return await this.trackModel
      .findByIdAndUpdate(track.id, updateTrackDto, {
        new: true,
      })
      .populate('artists');
  }

  async updateTrackImage(
    currentUser: UserDocument,
    id: string,
    image: Express.Multer.File,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Track))
      throw new UnauthorizedException(
        "You don't have permission to update an track",
      );

    const track = await this.trackModel.findById(id);

    if (!track) throw new NotFoundException('Track not found');

    const { secure_url } = await this.cloudinaryFactory.uploadStream(
      image.buffer,
      {
        folder: 'track',
        resource_type: 'image',
        public_id: track.id,
        overwrite: true,
        format: image.mimetype.split('/')[1],
      },
    );

    return this.trackModel
      .findByIdAndUpdate(track.id, { image: secure_url }, { new: true })
      .populate('artists');
  }

  async deleteTrack(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to delete a track');

    const track = await this.trackModel.findById(id);

    if (!track) throw new NotFoundException('Track not found');

    return await track.deleteOne();
  }

  async deleteSeveralTracks(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to delete a track');

    if (!query) throw new BadRequestException('Provide ids in query');

    const ids = query.split(',');

    if (ids.length > 20) throw new BadRequestException('App limit exceeded');

    const tracks = await this.trackModel
      .find({ _id: { $in: ids } })
      .select('_id');

    return await this.trackModel.deleteMany({
      _id: { $in: tracks.map((track) => track.id) },
    });
  }

  async addArtistToTrack(
    currentUser: UserDocument,
    trackId: string,
    artistId: string,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to update a track');

    const track = await this.trackModel.findById(trackId);

    const isExist = track.artists.some((artist) => artist === artistId);

    if (isExist) throw new BadRequestException('Artist already exist');

    track.artists.push(artistId);

    await track.save();

    return track.populate('artists');
  }

  async removeArtistFromTrack(
    currentUser: UserDocument,
    trackId: string,
    artistId: string,
  ) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Update, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to update a track');

    const track = await this.trackModel.findById(trackId);

    const isExist = track.artists.some((artist) => artist === artistId);
    if (!isExist)
      throw new NotFoundException('Artist does not exist on this track');

    const artists = track.artists.filter((artist) => artist !== artistId);

    track.artists = artists;

    return await track.save();
  }
}
