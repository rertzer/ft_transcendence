// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
import { staticBlock } from "@babel/types";
import { prismaService } from "./prisma.test";
import {userHasChatChannelsUser} from "./prisma.check";


export async function getIdOfLogin(login: string){
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

export async function addChatMessage(chatChanelId: number, chat_channels_username :string, message:string )
{
	console.log("chat_channels_id : ", chatChanelId);
	console.log("chat_channels_username : ", chat_channels_username);
	console.log("message : ", message);

	const chat_channels_user_id = await getIdOfLogin(chat_channels_username);
	if (chat_channels_user_id !== undefined)
	{
		console.log("chat_channels_user_id : ", chat_channels_user_id);
		const newMessage = await prismaService.chatMsgHistory.create({
			data: {
				message: message,
				chat_channels_id: chatChanelId,
				chat_channels_user_id: chat_channels_user_id,
			},
		})
	}
}

 export async function addChanelUser(channel_id : number, user_id : number, user_role:string, date_joined:Date, date_left:Date | null)
{
	console.log("in add chanel user date receive : ", date_joined);
	console.log("channel_id : ", channel_id);
	console.log("user_id : ", user_id);


	if (await userHasChatChannelsUser(user_id, channel_id)) {
		console.log("user already in chat");
	}
	else {
		const newMessage = await prismaService.chatChannelsUser.create ({
			data: {
				channel_id: channel_id,
				user_id: user_id,
				user_role: user_role,
				date_joined: date_joined,
				date_left: date_left,
			}
		})
	}
}

export async function addPrivateMessage(sender_id: number, receiver_id: number, message: string) {
	console.log("sender_id : ", sender_id);
	console.log("receiver_id : ", receiver_id);
	const newMessage = await prismaService.directMsg.create({
		data: {
			message: message,
			sender_id: sender_id,
			receiver_id: receiver_id,
			msg_status: 'unread',
		},
	})
}
