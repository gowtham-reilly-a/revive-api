import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { Serialize } from 'src/global/interceptors/serialize.interceptor';
import { CurrentUser } from '../global/decorators/current-user.decorator';
import { Roles } from '../global/decorators/roles.decorator';
import { RoleEnum } from '../global/enums/role.enum';
import { CreateUserFirebaseDto } from './dtos/create-user-firebase.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleDto } from './dtos/role.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize(UserDto)
  @Patch()
  patchUser(@CurrentUser() currentUser: DecodedIdToken) {
    return this.usersService.patch(currentUser);
  }

  @Serialize(UserDto)
  @Post()
  createUser(@Body() createUserDto: CreateUserFirebaseDto) {
    return this.usersService.createWithFirebase(createUserDto);
  }

  @Get('/:uid')
  @Serialize(UserDto)
  getUser(@Param('uid') uid: string) {
    return this.usersService.findByUID(uid);
  }

  @Get()
  @Serialize(UserDto)
  getServeralUsers() {
    return this.usersService.findAllUsers();
  }

  @Get('/me')
  whoAmI(@CurrentUser() user: UserRecord) {
    return user;
  }

  @Post('/roles')
  @Roles(RoleEnum.Admin)
  setUserRole(@Body() roleDto: RoleDto) {
    return this.usersService.setUserRole(roleDto);
  }
}
