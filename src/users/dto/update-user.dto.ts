import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
