import { RawRuleOf } from '@casl/ability';
import { AccessibleModel, AccessibleFieldsDocument } from '@casl/mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ModelTypeEnum } from 'src/global/enums/model-type.enum';
import { ProductEnum } from 'src/global/enums/product.enum';

export type UserDocument = User &
  AccessibleModel<User & AccessibleFieldsDocument>;

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
    type: MongooseSchema.Types.ObjectId,
    ref: 'Permission',
  })
  permission: { name: string; rules: RawRuleOf<AppAbility>[] };

  @Prop({
    type: String,
    default: ProductEnum.Free,
    enum: Object.values(ProductEnum),
  })
  product: ProductEnum;

  @Prop({
    type: String,
    default: ModelTypeEnum.User,
  })
  type: ModelTypeEnum.User;
}

export const UserSchema = SchemaFactory.createForClass(User);
