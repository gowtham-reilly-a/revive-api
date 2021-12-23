import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModelTypeEnum } from 'src/global/enums/model-type.enum';
import { ProductEnum } from 'src/global/enums/product.enum';
import { Rule, RuleSchema } from 'src/permissions/rule.model';

export type UserDocument = User & Document;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class User {
  @Prop({
    type: [String],
    ref: 'Artist',
    select: false,
  })
  artist_teams: string[];

  @Prop({
    type: String,
  })
  display_name?: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  _id: string;

  @Prop({
    type: String,
    default: ProductEnum.Free,
    enum: Object.values(ProductEnum),
  })
  product: ProductEnum;

  @Prop({
    type: [RuleSchema],
    select: false,
  })
  rules: Rule[];

  @Prop({
    type: String,
    default: ModelTypeEnum.User,
  })
  type: ModelTypeEnum.User;
}

export const UserSchema = SchemaFactory.createForClass(User);
