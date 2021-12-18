import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RoleDto } from './dtos/role.dto';
import { Role } from '../global/enums/role.enum';
import { UserDocument } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private firebaseService: FirebaseService,
  ) {}

  async setUserRole(roleDto: RoleDto) {
    try {
      const { uid, role } = roleDto;

      if (Role.Admin !== role && Role.Artist !== role)
        throw new BadRequestException("Doesn't match to any available roles");

      await this.firebaseService.getAuth().setCustomUserClaims(uid, {
        role,
      });

      return {
        message: 'Success',
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAllUsers() {
    try {
      return this.firebaseService.getAuth().listUsers();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserByUID(uid: string) {
    try {
      return this.firebaseService.getAuth().getUser(uid);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
