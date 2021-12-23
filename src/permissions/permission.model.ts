import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Rule, RuleSchema } from './rule.model';

export type PermissionDocument = Permission & Document<Permission>;

@Schema({
  timestamps: true,
})
export class Permission {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: [RuleSchema],
  })
  rules: Rule[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
