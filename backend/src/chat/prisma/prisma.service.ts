// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
import { prismaService } from "./prisma.test";

// const prisma = new PrismaClient()

export async function checkChatId(idSearched: number) {
	const chat = await prismaService.chatChannels.findFirst({
		where: {
			id: idSearched,
		},
	})
	if (chat) {
		return true;
	}
	else{
		return false;
	}
}

export async function checkLogin(login: string) {
	console.log("login asked : ", login);
	const user = await prismaService.user.findFirst({
		where: {
			username: login,
		},
	})
	if (user) {
		return true;
	}
	else{
		return false;
	}
}

export async function getIdOfLogin(login: string) {
	const user = await prismaService.user.findFirst({
		where: {
			username: login,
		}
	})
	if (user)
		return user.id;
}

export async function RetrieveMessage(login:string) {
	const id = await getIdOfLogin(login);
	const userDirectMessages = await prismaService.directMsg.findMany({
		where: {
		  OR: [
			{ sender_id: id},    // Messages where the user is the sender
			{ receiver_id: id},  // Messages where the user is the receiver
		  ],
		},
		include: {
		  sender: true,
		  receiver: true,
		},
	  });
	return userDirectMessages;
}
