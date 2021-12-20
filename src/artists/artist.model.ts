import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModelTypeEnum } from 'src/global/enums/model-type.enum';

export type ArtistDocument = Artist & Document;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Artist {
  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: Map,
    of: String,
  })
  external_urls?: {
    [key: string]: string;
  };

  @Prop({
    type: String,
    required: true,
  })
  _id: string;

  @Prop({
    type: Map,
    of: String,
    required: true,
  })
  image: { url: string; height: string; width: string };

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    default: ModelTypeEnum.Artist,
  })
  type: ModelTypeEnum.Artist;

  @Prop({
    type: String,
    required: true,
  })
  uri: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
