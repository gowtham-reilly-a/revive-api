import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.model';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Post()
  createPermission(
    @CurrentUser() currentUser: UserDocument,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    return this.permissionsService.createPermission(
      currentUser,
      createPermissionDto,
    );
  }

  @Get(':id')
  getPermission(
    @CurrentUser() currentUser: UserDocument,
    @Param('id') id: string,
  ) {
    return this.permissionsService.getPermission(currentUser, id);
  }

  @Get()
  listPermissions(@CurrentUser() currentUser: UserDocument) {
    return this.permissionsService.listPermissions(currentUser);
  }
}
