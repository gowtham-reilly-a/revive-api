import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModelTypeEnum } from 'src/global/enums/model-type.enum';
import { nanoid } from 'src/utils/nanoid';
import { AlbumTypeEnum } from './enums/album-type.enum';

export type AlbumDocument = Album & Document<Album>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Album {
  @Prop({
    type: String,
    required: true,
    enum: [
      AlbumTypeEnum.Album,
      AlbumTypeEnum.Compilation,
      AlbumTypeEnum.Single,
    ],
  })
  album_type: AlbumTypeEnum;

  @Prop({
    type: [String],
    ref: 'Artist',
  })
  artists: string[];

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
    type: Date,
    required: true,
  })
  release_date: Date;

  @Prop({
    type: String,
    ref: 'Track',
  })
  tracks: string[];

  @Prop({
    type: String,
    default: ModelTypeEnum.Album,
  })
  type: ModelTypeEnum.Album;

  @Prop({
    type: String,
    required: true,
  })
  uri: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

AlbumSchema.virtual('total_tracks').get(function () {
  return this.tracks.length;
});
