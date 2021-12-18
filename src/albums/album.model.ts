import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  coverImage: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  })
  createdBy: ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  releaseDate: Date;

  @Prop({
    type: Date,
  })
  lastModifiedAt: Date;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Artist',
  })
  artists: ObjectId[];

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Track',
  })
  tracks: ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
