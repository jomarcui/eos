export class CreateUserDto {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}
