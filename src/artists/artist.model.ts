import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
  @Prop({
    type: String,
    required: true,
  })
  uid: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Track',
  })
  tracks: ObjectId[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
