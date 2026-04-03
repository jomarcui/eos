import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { RequestUser } from '@common/interfaces/request-user.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new Error('Authenticated user is not available on request');
    }

    return user;
  },
);
