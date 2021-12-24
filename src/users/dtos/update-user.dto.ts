import { IsOptional, IsString } from 'class-validator';
import { DeepPartial } from 'mongoose';
import { ProductEnum } from 'src/global/enums/product.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  display_name?: string;

  @IsString()
  @IsOptional()
  product?: DeepPartial<ProductEnum>;

  @IsString()
  @IsOptional()
  permission?: string;
}
