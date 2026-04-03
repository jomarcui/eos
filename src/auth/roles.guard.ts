import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enums';
import { RequestUser } from '@common/interfaces/request-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // Explicitly type the request
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: RequestUser }>();
    const user = request.user;

    return requiredRoles.includes(user.role);
  }
}
