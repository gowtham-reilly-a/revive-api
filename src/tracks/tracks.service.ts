import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';
import { Track, TrackDocument } from './track.model';

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  async create(createDto: CreateTrackDto) {
    const track = new this.trackModel(createDto);

    return track.save();
  }

  async findOne(id: string) {
    try {
      const track = await this.trackModel.findById(id);

      if (!track) throw new NotFoundException('Track not found');

      return track;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return this.trackModel.find();
  }

  async delete(id: string) {
    return this.trackModel.findByIdAndDelete(id);
  }

  async update(id: string, updateDto: UpdateTrackDto) {
    return this.trackModel.findByIdAndUpdate({ id }, updateDto);
  }
}
