import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

const config = new ConfigService();
const prismaService = new PrismaService(config);

export async function getIdOfLogin(login: string) {
  const user = await prismaService.user.findFirst({
    where: {
      username: login,
    },
  });
  if (user) return user.id;
}
