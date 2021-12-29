import { BadRequestException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { CaslModule } from 'src/casl/casl.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ArtistMembersController } from './artist-members.controller';
import { Artist, ArtistDocument, ArtistSchema } from './artist.model';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        inject: [ConfigService],
        name: Artist.name,
        useFactory(configService: ConfigService) {
          const schema = ArtistSchema;
          const appName = configService.get<string>('APP_NAME').toLowerCase();

          schema.pre('save', function (this: ArtistDocument, next) {
            this.uri = `${appName}:artist:${this.id}`;

            next();
          });

          return schema;
        },
      },
    ]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          fileFilter(req, file, cb) {
            if (!file.mimetype.startsWith('image'))
              cb(new BadRequestException('Upload image types only'), false);
            else cb(null, true);
          },
          limits: {
            fileSize: parseInt(config.get<string>('MAX_IMAGE_UPLOAD_SIZE')),
          },
        };
      },
    }),
    CaslModule,
    CloudinaryModule,
  ],
  controllers: [ArtistsController, ArtistMembersController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
