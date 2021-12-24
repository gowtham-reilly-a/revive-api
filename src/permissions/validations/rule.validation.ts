import { RawRuleOf } from '@casl/ability';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AppAbility } from 'src/casl/casl-ability.factory';

@ValidatorConstraint({ name: 'rule' })
export class RuleValidation implements ValidatorConstraintInterface {
  validate(rules: RawRuleOf<AppAbility>[], args: ValidationArguments) {
    return (
      Array.isArray(rules) &&
      rules.length > 0 &&
      rules.reduce((prev, cur) => {
        if (!cur.action) return false;

        if (typeof cur.action !== 'string') return false;

        if (cur.subject && typeof cur.subject !== 'string') return false;

        if (
          cur.fields &&
          typeof cur.fields !== 'string' &&
          !Array.isArray(cur.fields)
        )
          return false;

        if (
          cur.fields &&
          Array.isArray(cur.fields) &&
          cur.fields.length &&
          !cur.fields.every((field) => typeof field === 'string')
        )
          return false;

        if (cur.inverted && typeof cur.inverted !== 'boolean') return false;

        if (cur.reason && typeof cur.reason !== 'string') return false;

        return true;
      }, true)
    );
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Provided incompatible rules';
  }
}
