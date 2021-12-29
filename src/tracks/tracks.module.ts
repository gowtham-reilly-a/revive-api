import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
          const appRootURL = configService.get<string>('APP_ROOT_URL');
          const appName = configService.get<string>('APP_NAME').toLowerCase();

          schema.pre('save', function (this: TrackDocument, next) {
            this.uri = `${appName}:track:${this.id}`;
            this.set(
              `external_urls.${appName}`,
              `${appRootURL}/track/${this.id}`,
            );

            next();
          });

          return schema;
        },
      },
    ]),
    CaslModule,
    CloudinaryModule,
  ],
  controllers: [TracksController, TrackArtistsController],
  providers: [TracksService],
})
export class TracksModule {}
