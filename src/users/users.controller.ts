import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { CurrentUser } from '../global/decorators/current-user.decorator';
import { Roles } from '../global/decorators/roles.decorator';
import { Role } from '../global/enums/role.enum';
import { RoleDto } from './dtos/role.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  whoAmI(@CurrentUser() user: UserRecord) {
    return user;
  }

  @Post('/roles')
  @Roles(Role.Admin)
  setUserRole(@Body() roleDto: RoleDto) {
    return this.usersService.setUserRole(roleDto);
  }

  @Get()
  @Roles(Role.Admin)
  getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get('/:uid')
  @Roles(Role.Admin)
  getUserByUID(@Param('uid') uid: string) {
    return this.getUserByUID(uid);
  }
}
