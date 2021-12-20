import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RoleDto } from './dtos/role.dto';
import { RoleEnum } from '../global/enums/role.enum';
import { UserDocument } from './user.model';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private firebaseService: FirebaseService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async setUserRole(roleDto: RoleDto) {
    try {
      const { uid, role } = roleDto;

      if (RoleEnum.Admin !== role && RoleEnum.Artist !== role)
        throw new BadRequestException("Doesn't match to any available roles");

      await this.firebaseService.getAuth.setCustomUserClaims(uid, {
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
      return this.firebaseService.getAuth.listUsers();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findByUID(uid: string) {
    try {
      const [dbUserData, firebaseUserData] = await Promise.all([
        this.userModel.findOne({ uid }),
        this.firebaseService.getAuth.getUser(uid),
      ]);

      return { ...dbUserData, ...firebaseUserData };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
