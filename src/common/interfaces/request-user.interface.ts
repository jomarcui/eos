import { UserRole } from '../../users/enums/user-role.enums';

export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
}
