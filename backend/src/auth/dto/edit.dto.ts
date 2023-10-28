import {
    IsEmail,
    IsNotEmpty,
    IsString,  
  } from 'class-validator';
  
  export class EditDto {
    @IsString()
    @IsNotEmpty()
    login: string;
    
    @IsString()
    username?: string;
  
    @IsString()
    password?: string;

    @IsEmail()
    email?: string;

    @IsString()
    avatar?: string;
  }