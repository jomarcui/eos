import { UserRole } from '../users/enums/user-role.enums';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
    };
  }
}
