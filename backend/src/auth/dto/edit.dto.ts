import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,  
  } from 'class-validator';
  
  export class EditDto {
    @IsString()
    @IsNotEmpty()
    login: string;
    
    @IsString()
    @IsOptional()
    username?: string;
  
    @IsString()
    @IsOptional()
    password?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
  }