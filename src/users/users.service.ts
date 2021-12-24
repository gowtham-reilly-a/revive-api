import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User, UserDocument } from './user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ActionEnum } from 'src/global/enums/action.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private firebaseService: FirebaseService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.firebaseService.getAuth.createUser(createUserDto);
      return this.userModel.create({ _id: user.uid, email: user.email });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getCurrentUser(id: string) {
    const user = await this.userModel.findById(id).populate('permission');

    console.log(user);

    return user;
  }

  async getUser(currentUser: UserDocument, id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getUserByEmail(email: string) {
    try {
      return this.userModel.findOne({ email });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getSeveralUsers(query: string) {
    try {
      const ids = query.split(',');

      if (ids.length > 50)
        throw new BadRequestException('The app has exceeded its rate limits.');

      return this.userModel.find().where('_id').in(ids).exec();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateUserEmail(id: string, email: string) {
    try {
      await this.firebaseService.getAuth.updateUser(id, { email });
      return this.userModel.findByIdAndUpdate(id, { email }, { new: true });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteUser(id: string) {
    try {
      await this.firebaseService.getAuth.deleteUser(id);
      return this.userModel.findByIdAndDelete(id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteSeveralUsers(query: string) {
    try {
      const ids = query.split(',');

      if (ids.length > 50)
        throw new BadRequestException('The app has exceeded its rate limits.');

      await this.firebaseService.getAuth.deleteUsers(ids);
      return this.userModel.findByIdAndDelete().in(ids).exec();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
