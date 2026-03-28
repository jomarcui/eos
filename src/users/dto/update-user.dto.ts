// src/users/dto/update-user.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  role?: string; // ⚠️ restrict in service if needed

  @IsOptional()
  status?: string;
}
