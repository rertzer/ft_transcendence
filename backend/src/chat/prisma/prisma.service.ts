
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

export async function getPasswordOfChat(chat_channels_id: number){
	const chat = await prismaService.chatChannels.findFirst({
		where: {
			id: chat_channels_id,
		}
	})
	if (chat)
		return chat.password;
}



export async function getIdOfChatChannelsUser(login: string, chat_channels_id: number){

	console.log("login : ", login);
	const idOfUser = await getIdOfLogin(login);
	console.log("id of user : ", idOfUser);

	const user = await prismaService.chatChannelsUser.findFirst({
		where: {
			user_id: idOfUser,
			channel_id: chat_channels_id,
		}
	})
	if (user)
	{
		console.log("user id : ", user.id);
		return user.id;
	}
	else {
		
	}
}

export async function RetrievePrivateMessage(login:string) {
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

export async function RetrieveChatMessage(chat_channels_id: number) {
		// Find the chat channel by its ID
		const chatChannel = await prismaService.chatChannels.findUnique({
		  where: {
			id: chat_channels_id,
		  },
		  include: {
			// Include the related chat messages (ChatMsgHistory)
			chatMessages: true,
		  },
		});
		if (chatChannel)
		{
			console.log(chatChannel.chatMessages);
			return chatChannel.chatMessages;
		}
}

export async function addChatMessage(chatChanelId: number, chat_channels_username :string, message:string, date:Date )
{
	console.log("chat_channels_id : ", chatChanelId);
	console.log("chat_channels_username : ", chat_channels_username);
	console.log("message : ", message);

	const chat_channels_user_id = await getIdOfChatChannelsUser(chat_channels_username, chatChanelId);
	if (chat_channels_user_id !== undefined)
	{
		console.log("chat_channels_user_id : ", chat_channels_user_id);
		const newMessage = await prismaService.chatMsgHistory.create({
			data: {
				date_sent: date,
				message: message,
				chat_channels_id: chatChanelId,
				chat_channels_user_id: chat_channels_user_id,
			},
		})
	}
	else
	{
		console.log("issue addchat mesasge.")
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

export async function findUser(chat_channels_user_id: number) {
	const user = await prismaService.chatChannelsUser.findUnique({
		where: {
			id: chat_channels_user_id,
		},
		include: {
			chatChannelsUser: true,
		},
	})
	if (user)
	{
		return user.chatChannelsUser.username;
	}
}


export async function addChat(chatName: string, chatType: string, chatOwnerId: number, chatPassword: string) {

	const newChat = await prismaService.chatChannels.create({
		data: {
			type: chatType,
			name: chatName,
			password: chatPassword,
			channelOwner: {
				connect: { id: chatOwnerId }
			}
		}
	})
	return newChat.id;

}
