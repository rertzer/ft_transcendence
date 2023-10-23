import {
  IsNotEmpty,
  IsString,
  IsEmail,
} from 'class-validator';

export class AuthDto {
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
