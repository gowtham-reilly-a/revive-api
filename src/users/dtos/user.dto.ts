import { Expose } from 'class-transformer';
import { Rule } from '../rule.model';

export class UserDto {
  @Expose({
    toPlainOnly: true,
  })
  artist_teams?: string[];

  @Expose()
  display_name?: string;

  @Expose()
  email: string;

  @Expose()
  id: string;

  @Expose()
  product: string;

  @Expose({
    toPlainOnly: true,
  })
  rules?: Rule[];

  @Expose()
  type: string;
}
