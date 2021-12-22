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
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { Serialize } from 'src/global/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserDocument } from './user.model';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  getUser(@Param('id') id: string, @CurrentUser() currentUser: UserDocument) {
    return this.usersService.getUser(currentUser, id);
  }

  @Get()
  getSeveralUsers(@Query('ids') query: string) {
    return this.usersService.getSeveralUsers(query);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Delete()
  deleteSeveralUsers(@Query('ids') query: string) {
    return this.usersService.deleteSeveralUsers(query);
  }
}
