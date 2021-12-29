import { Module } from '@nestjs/common';
import { CloudinaryFactory } from './cloudinary-factory';

@Module({
  providers: [CloudinaryFactory],
  exports: [CloudinaryFactory],
})
export class CloudinaryModule {}
