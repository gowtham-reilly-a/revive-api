import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { Serialize } from 'src/global/interceptors/serialize.interceptor';
import { CurrentUser } from '../global/decorators/current-user.decorator';
import { Roles } from '../global/decorators/roles.decorator';
import { RoleEnum } from '../global/enums/role.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleDto } from './dtos/role.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
