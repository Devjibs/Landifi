import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoleBasedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.userId) {
      throw new NotFoundException('User ID not found!');
    }

    const routePermissions = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    try {
      const userPermissions = await this.userService.getUserPermission(
        request.userId,
      );
      if (routePermissions.includes(userPermissions)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
