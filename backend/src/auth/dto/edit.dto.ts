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
    first_name?: string;
    
    @IsString()
    @IsOptional()
    last_name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    avatar?: string;
  }