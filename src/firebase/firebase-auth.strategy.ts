import { PassportStrategy } from '@nestjs/passport';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { FirebaseService } from './firebase.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {
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

      return this.usersService.getUser(null, decodedIdToken.uid);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
