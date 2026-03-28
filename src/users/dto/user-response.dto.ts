import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: Date;
  updated_at: Date;

  @Exclude()
  password_hash: string;
}
