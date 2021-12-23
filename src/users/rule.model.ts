import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Action, Subjects } from 'src/casl/casl-ability.factory';
import { ActionEnum } from 'src/global/enums/action.enum';
import { SubjectEnum } from 'src/global/enums/subject.enum';

@Schema()
export class Rule {
  @Prop({
    type: String,
    required: true,
    enum: Object.values(ActionEnum),
  })
  action: Action;

  @Prop({
    type: String,
    enum: Object.values(SubjectEnum),
  })
  subject?: Subjects;

  @Prop({
    type: [String],
  })
  fields?: string[];

  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  conditions?: any;

  @Prop({
    type: Boolean,
  })
  inverted?: boolean;

  @Prop({
    type: String,
  })
  reason?: string;
}

export const RuleSchema = SchemaFactory.createForClass(Rule);
