import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, initializeApp, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseService {
  private app: App;
  private auth: Auth;
  private storage: Storage;

  constructor(private configService: ConfigService) {
    this.app = initializeApp({
      credential: cert({
        projectId: configService.get('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
        privateKey: configService
          .get('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
      }),
    });

    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
  }

  getApp() {
    return this.app;
  }

  get getAuth() {
    return this.auth;
  }

  getStorage() {
    return this.storage.bucket();
  }
}
