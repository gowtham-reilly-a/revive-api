import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModelTypeEnum } from 'src/global/enums/model-type.enum';
import { ProductEnum } from 'src/global/enums/product.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    type: String,
  })
  display_name: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    default: ProductEnum.Free,
  })
  product: ProductEnum;

  @Prop({
    type: String,
    default: ModelTypeEnum.User,
  })
  type: ModelTypeEnum.User;

  @Prop({
    type: String,
    required: true,
  })
  uid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
