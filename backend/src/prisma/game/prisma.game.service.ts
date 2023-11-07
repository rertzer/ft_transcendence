import { PrismaClient } from '@prisma/client'
import { Injectable } from "@nestjs/common";


@Injectable()
export class PrismaGameService {
	private prismaService: PrismaClient;

	constructor() {
		this.prismaService = new PrismaClient();
	  }


	async getIdOfLogin(login: string){

		const user = await this.prismaService.user.findFirst({
			where: {
				username: login,
			}
		})
		if (user)
			return user.id;
	}
}
