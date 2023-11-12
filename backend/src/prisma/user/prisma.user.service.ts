import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

const config = new ConfigService();
const prismaService = new PrismaService(config);

export async function getIdByLogin(login: string) {
  console.log('inside getIdOfLogin');
  const user = await prismaService.user.findFirst({
    where: {
      login,
    },
  });
  console.log('seeking for ', login), 'user is', user;
  if (user) return user.id;
}

export async function getUserByLogin(login: string) {
  console.log('UserService received: ', login);
  let user = await prismaService.user.findUnique({
    where: {
      login: login,
    },
  });
  if (user) {
    user.password = 'nope';
    return user;
  } else {
    return null;
  }
}
