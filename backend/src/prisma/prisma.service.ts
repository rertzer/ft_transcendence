import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor() {
        super({
            datasources: {
                db: {
                    url: "postgresql://trans:arstneio42@postgres:5432/transendence?schema=public",
                    
                }
            }
        })
    }
}
