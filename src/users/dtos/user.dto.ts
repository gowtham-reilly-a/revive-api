import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  display_name: string;

  @Expose()
  email: string;

  @Expose()
  id: string;

  @Expose()
  product: string;

  @Expose()
  type: string;
}
