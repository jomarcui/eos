import { Request } from 'express';
import { RequestUser } from 'src/common/interfaces/request-user.interface';

export interface AuthRequest extends Request {
  user: RequestUser;
}
