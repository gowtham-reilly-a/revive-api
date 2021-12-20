import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackDocument, TrackSchema } from './track.model';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        inject: [ConfigService],
        name: 'Track',
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
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
