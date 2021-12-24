import { RawRuleOf } from '@casl/ability';
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { RuleValidation } from '../validations/rule.validation';

export class CreatePermissionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(RuleValidation)
  rules: RawRuleOf<AppAbility>[];
}
