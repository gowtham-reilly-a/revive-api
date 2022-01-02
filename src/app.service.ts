import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This API is built by Gowtham Reilly.';
  }
}
