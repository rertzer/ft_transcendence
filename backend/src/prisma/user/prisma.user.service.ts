
import {PrismaService} from "../prisma.service";

const prismaService = new PrismaService;

export async function getIdOfLogin(login: string){
	const user = await prismaService.user.findFirst({
		where: {
			username: login,
		}
	})
	if (user)
		return user.id;
}

