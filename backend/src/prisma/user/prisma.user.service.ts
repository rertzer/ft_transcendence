import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import * as argon from 'argon2';
import { EditDto, LoginDto } from 'src/auth/dto';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const config = new ConfigService();
const prismaService = new PrismaService(config);

export async function getUserByLogin(login: string) {
  let user = await prismaService.user.findUnique({
    where: {
      login: login,
    },
  });
  if (user) {
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
  try {
    const user = await prismaService.user.update({
      where: {
        login: dto.login,
      },
      data: dto,
    });
    return user;
  } catch (error) {
    throw new BadRequestException('Bad request');
  }
}

export async function createUser(dto: LoginDto) {
  try {
    const user = await prismaService.user.create({
      data: {
        login: dto.login,
        email: dto.login + '@student.42.fr',
        role: 'player',
      },
    });
    return user;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('user already exist');
      }
      throw error;
    }
  }
  return null;
}
