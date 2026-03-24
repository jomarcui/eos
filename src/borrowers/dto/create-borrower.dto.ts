import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateBorrowerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(7, { message: 'Phone number too short' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
