import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Artist',
  })
  artists: ObjectId[];

  @Prop({
    type: Date,
  })
  releasedAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Artist',
  })
  createdBy: ObjectId;

  @Prop({
    type: Date,
  })
  lastModifiedAt: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Artist',
  })
  lastModifiedBy: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tag',
  })
  tag: ObjectId;

  @Prop({
    type: Number,
  })
  durationMs: number;

  @Prop({
    type: String,
    required: true,
  })
  coverImage: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
