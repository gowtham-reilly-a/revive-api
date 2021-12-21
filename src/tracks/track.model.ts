import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModelTypeEnum } from 'src/global/enums/model-type.enum';
import { nanoid } from 'src/utils/nanoid';

export type TrackDocument = Track & Document;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Track {
  @Prop({
    type: String,
    ref: 'Album',
  })
  album: string;

  @Prop({
    type: [String],
    ref: 'Artist',
  })
  artists: string[];

  @Prop({
    type: Number,
    required: true,
  })
  duration_ms: number;

  @Prop({
    type: Map,
    of: String,
  })
  external_urls?: {
    [key: string]: string;
  };

  @Prop({
    type: String,
    default: () => nanoid(),
  })
  _id: string;

  @Prop({
    type: String,
    required: true,
  })
  image: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    default: ModelTypeEnum.Track,
  })
  type: ModelTypeEnum.Track;

  @Prop({
    type: String,
    required: true,
  })
  uri: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
