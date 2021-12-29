import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AlbumArtistsController } from './album-artists.controller';
import { AlbumTracksController } from './album-tracks.controller';
import { Album, AlbumDocument, AlbumSchema } from './album.model';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        inject: [ConfigService],
        name: Album.name,
        useFactory(configService: ConfigService) {
          const schema = AlbumSchema;
          const appName = configService.get<string>('APP_NAME').toLowerCase();

          schema.pre('save', function (this: AlbumDocument, next) {
            this.uri = `${appName}:album:${this.id}`;
            next();
          });

          return schema;
        },
      },
    ]),
    CaslModule,
    CloudinaryModule,
  ],
  controllers: [
    AlbumsController,
    AlbumTracksController,
    AlbumArtistsController,
  ],
  providers: [AlbumsService],
})
export class AlbumsModule {}
