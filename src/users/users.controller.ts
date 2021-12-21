import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Serialize } from 'src/global/interceptors/serialize.interceptor';
import { CurrentUser } from '../global/decorators/current-user.decorator';
import { Roles } from '../global/decorators/roles.decorator';
import { RoleEnum } from '../global/enums/role.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleDto } from './dtos/role.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get()
  getSeveralUsers(@Query('ids') query: string) {
    return this.usersService.getSeveralUsers(query);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Delete()
  deleteSeveralUsers(@Query('ids') query: string) {
    return this.usersService.deleteSeveralUsers(query);
  }

  @Post('/roles')
  @Roles(RoleEnum.Admin)
  setUserRole(@Body() roleDto: RoleDto) {
    return this.usersService.setUserRole(roleDto);
  }

  @Patch()
  patchUser(@CurrentUser() currentUser: DecodedIdToken) {
    return this.usersService.patch(currentUser);
  }
}
