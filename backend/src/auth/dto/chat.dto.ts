import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    Matches,  
  } from 'class-validator';

export class SetAdminDto {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsNumber()
    chatId:number;
  }