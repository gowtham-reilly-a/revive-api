import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
          const appRootURL = configService.get<string>('APP_ROOT_URL');
          const appName = configService.get<string>('APP_NAME').toLowerCase();

          schema.pre('save', function (this: ArtistDocument, next) {
            this.uri = `${appName}:artist:${this.id}`;
            this.set(
              `external_urls.${appName}`,
              `${appRootURL}/artist/${this.id}`,
            );

            next();
          });

          return schema;
        },
      },
    ]),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
