import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsModule } from 'src/artists/artists.module';
import { CaslModule } from 'src/casl/casl.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TrackArtistsController } from './track-artists.controller';
import { Track, TrackDocument, TrackSchema } from './track.model';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        inject: [ConfigService],
        name: Track.name,
        useFactory(configService: ConfigService) {
          const schema = TrackSchema;
          const appName = configService.get<string>('APP_NAME').toLowerCase();

          schema.pre('save', function (this: TrackDocument, next) {
            this.uri = `${appName}:track:${this.id}`;
            next();
          });

          return schema;
        },
      },
    ]),
    CaslModule,
    CloudinaryModule,
    ArtistsModule,
  ],
  controllers: [TracksController, TrackArtistsController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
