import {
    IsEmail,
    IsNotEmpty,
    IsString,  
  } from 'class-validator';
  
  export class FtUser {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;
    
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
  }