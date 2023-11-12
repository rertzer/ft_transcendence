import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import * as argon from 'argon2';
import { EditDto } from 'src/auth/dto';
import { BadRequestException } from '@nestjs/common';

const config = new ConfigService();
const prismaService = new PrismaService(config);

export async function getUserByLogin(login: string) {
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

export async function getIdByLogin(login: string) {
  const data = await prismaService.user.findFirst({
    select: { id: true },
    where: {
      login,
    },
  });
  if (data) return data.id;
}

export async function getAvatarByLogin(login: string) {
  const data = await prismaService.user.findFirst({
    select: { avatar: true },
    where: {
      login,
    },
  });
  if (data) return data.avatar;
}

export async function updateUser(dto: EditDto) {
  if (dto.password) {
    dto.password = await argon.hash(dto.password);
  }
  try {
    const user = await prismaService.user.update({
      where: {
        login: dto.login,
      },
      data: dto,
    });
    user.password = 'nope';
    return user;
  } catch (error) {
    throw new BadRequestException('Bad request');
  }
}
