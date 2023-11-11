import {
    ForbiddenException,
    ImATeapotException,
    Injectable,
  } from '@nestjs/common';

  import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
  import { PrismaService } from '../prisma/prisma.service';
 

  
  import { User } from '@prisma/client';
  import { Express } from 'express';
  import { ConfigService } from '@nestjs/config';
  import { promises } from 'dns';
  
  @Injectable()
  export class FtAuthService {
    constructor(
      private prisma: PrismaService,

      private config: ConfigService,
    ) {}
  
    async loginCb(req:any) {
     
       console.log("ftauth login");
       if (!req.user){
        return ('42 Panic');
       }      
       return {
        message: 'Don\'t Panic',
        user: req.user
       }
    } // end of login()
  }
  