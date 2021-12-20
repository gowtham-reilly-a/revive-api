import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private firebaseService: FirebaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(token: string) {
    try {
      const decodedIdToken = await this.firebaseService.getAuth.verifyIdToken(
        token,
        true,
      );

      if (!decodedIdToken) {
        throw new UnauthorizedException();
      }

      return decodedIdToken;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(err.message);
    }
  }
}
