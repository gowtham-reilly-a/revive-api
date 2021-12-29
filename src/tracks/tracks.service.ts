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

    const track = await this.trackModel.findById(id);

    if (ability.cannot(ActionEnum.Read, track))
      throw new UnauthorizedException('You are not allowed to read this track');

    return track;
  }

  async getSeveralTracks(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to read a track');

    const ids = query.split(',');

    if (ids.length > 50) throw new BadRequestException('App limit exceeded');

    const tracks = await this.trackModel.find().where('id').in(ids).exec();

    const allowedToRead = tracks.filter((track) =>
      ability.can(ActionEnum.Read, track),
    );

    if (!allowedToRead.length)
      throw new UnauthorizedException(
        'You are not allowed to read these tracks',
      );

    return allowedToRead;
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

    if (ability.cannot(ActionEnum.Update, track))
      throw new UnauthorizedException(
        'You are not allowed to update this track',
      );

    return await track.update(updateTrackDto);
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

    if (ability.cannot(ActionEnum.Update, track))
      throw new UnauthorizedException(
        "You don't have permission to update this track",
      );

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

    return this.trackModel.findByIdAndUpdate(
      id,
      { image: secure_url },
      { new: true },
    );
  }

  async deleteTrack(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to delete a track');

    const track = await this.trackModel.findById(id);

    if (ability.cannot(ActionEnum.Delete, track))
      throw new UnauthorizedException(
        'You are not allowed to delete this track',
      );

    return await track.delete();
  }

  async deleteSeveralTracks(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Track))
      throw new UnauthorizedException('You are not allowed to delete a track');

    const ids = query.split(',');

    if (ids.length > 50) throw new BadRequestException('App limit exceeded');

    const tracks = await this.trackModel.find().where('id').in(ids).exec();

    const allowedToDelete: TrackDocument[] = tracks.filter(
      (track: TrackDocument): boolean => ability.can(ActionEnum.Delete, track),
    );

    if (!allowedToDelete.length)
      throw new UnauthorizedException(
        'You are not allowed to delete these tracks',
      );

    return await this.trackModel
      .findByIdAndDelete()
      .where('id')
      .in(allowedToDelete.map((track) => track.id))
      .exec();
  }
}
