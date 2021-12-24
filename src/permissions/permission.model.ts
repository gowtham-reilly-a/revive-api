import { RawRuleOf } from '@casl/ability';
import { AccessibleFieldsDocument, AccessibleModel } from '@casl/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { RuleSchema } from './rule.model';

export type PermissionDocument = Permission &
  AccessibleModel<Permission & AccessibleFieldsDocument>;

@Schema({
  timestamps: true,
})
export class Permission {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  name: string;

  @Prop({
    type: [RuleSchema],
  })
  rules: RawRuleOf<AppAbility>[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
