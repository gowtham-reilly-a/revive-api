import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ActionEnum } from 'src/global/enums/action.enum';
import { SubjectEnum } from 'src/global/enums/subject.enum';
import { UserDocument } from 'src/users/user.model';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { Permission, PermissionDocument } from './permission.model';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionsModel: Model<PermissionDocument>,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async createPermission(
    currentUser: UserDocument,
    createPermissionDto: CreatePermissionDto,
  ) {
    try {
      const ability = this.caslAbilityFactory.getAblility(
        currentUser.permission.rules,
      );

      if (ability.cannot(ActionEnum.Create, SubjectEnum.Permission))
        throw new UnauthorizedException(
          'You are not allowed to create permission',
        );

      return await this.permissionsModel.create(createPermissionDto);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getPermission(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Permission))
      throw new UnauthorizedException('You are not allowed to read permission');

    const permission = await this.permissionsModel.findById(id);

    if (!permission) throw new NotFoundException('Permission not found');

    if (ability.cannot(ActionEnum.Read, permission))
      throw new UnauthorizedException(
        'You are not allowed to read this permission',
      );

    return permission;
  }

  async getSeveralPermissions(currentUser: UserDocument, query: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Permission))
      throw new UnauthorizedException('You are not allowed to read permission');

    const ids = query.split(',');

    const permissions = await this.permissionsModel
      .find()
      .where('id')
      .in(ids)
      .exec();

    return permissions.filter((permission) =>
      ability.can(ActionEnum.Read, permission),
    );
  }

  async listPermissions(currentUser: UserDocument) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Read, SubjectEnum.Permission))
      throw new UnauthorizedException('You are not allowed to read permission');

    const permissions = await this.permissionsModel.find();

    return permissions.filter((permission) =>
      ability.can(ActionEnum.Read, permission),
    );
  }

  async deletePermission(currentUser: UserDocument, id: string) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Permission))
      throw new UnauthorizedException(
        'You are not allowed to delete a permission',
      );

    const permission = await this.permissionsModel.findById(id);

    if (!permission) throw new NotFoundException('Permission not found');

    if (ability.cannot(ActionEnum.Delete, permission))
      throw new UnauthorizedException(
        'You are not allowed to delete this permission',
      );

    return permission;
  }

  async deleteSeveralPermissions(currentUser: UserDocument, ids: string[]) {
    const ability = this.caslAbilityFactory.getAblility(
      currentUser.permission.rules,
    );

    if (ability.cannot(ActionEnum.Delete, SubjectEnum.Permission))
      throw new UnauthorizedException(
        'You are not allowed to delete a permission',
      );

    const permissions = await this.permissionsModel
      .find()
      .where('id')
      .in(ids)
      .exec();

    if (!permissions.length)
      throw new NotFoundException('Permissions not found');

    const allowedToDelete = permissions.filter((permission) =>
      ability.can(ActionEnum.Delete, permission),
    );

    if (!allowedToDelete.length)
      throw new UnauthorizedException(
        "You don't have permission to delete these permissions",
      );

    return this.permissionsModel
      .deleteMany()
      .where('id')
      .in(allowedToDelete.map(({ id }) => id))
      .exec();
  }
}
