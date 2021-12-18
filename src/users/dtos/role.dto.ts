import { IsString, IsUppercase } from 'class-validator';

export class RoleDto {
  @IsString({ message: 'Must be a string' })
  @IsUppercase({ message: 'Must be all uppercase letters' })
  role: string;

  @IsString()
  uid: string;
}
