import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModelTypeEnum } from 'src/global/enums/model-type.enum';
import { nanoid } from 'src/utils/nanoid';

export type ArtistDocument = Artist & Document;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Artist {
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
    default:
      'https://res.cloudinary.com/gowthamreilly/image/upload/v1640693120/artist/default_ocqigk.jpg',
  })
  image?: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: [String],
    ref: 'User',
    select: false,
  })
  members?: string[];

  @Prop({
    type: String,
    default: ModelTypeEnum.Artist,
  })
  type: ModelTypeEnum.Artist;

  @Prop({
    type: String,
  })
  uri?: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
