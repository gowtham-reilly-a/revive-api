import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryFactory {
  private cloudinary: typeof v2;

  constructor(private configService: ConfigService) {
    this.cloudinary = v2;

    this.cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  uploadStream(
    fileBuffer: Buffer,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(options, (err, res) => {
          if (err) {
            console.log(err);
            reject(new BadRequestException(err.message));
          } else {
            resolve(res);
          }
        })
        .end(fileBuffer);
    });
  }
}
