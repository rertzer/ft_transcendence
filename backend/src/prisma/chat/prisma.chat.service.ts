import { PrismaClient } from '@prisma/client'
import { Injectable } from "@nestjs/common";


export enum ChatType {
	NotExisting = -1,
	Public = 0,
	Private = 1,
	Password = 2,

}

@Injectable()
export class PrismaChatService {
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

	async getPasswordOfChat(chat_channels_id: number){
		const chat = await this.prismaService.chatChannels.findFirst({
			where: {
				id: chat_channels_id,
			}
		})
		if (chat)
			return chat.password;
	}



	async getIdOfChatChannelsUser(login: string, chat_channels_id: number){

		//console.log("login : ", login);
		const idOfUser = await this.getIdOfLogin(login);
		//console.log("id of user : ", idOfUser);

		const user = await this.prismaService.chatChannelsUser.findFirst({
			where: {
				user_id: idOfUser,
				channel_id: chat_channels_id,
			}
		})
		if (user)
		{
			//console.log("user id : ", user.id);
			return user.id;
		}
		else {

		}
	}

	async changeChatUserRole(chat_channels_id: number, username : string, user_role: string)
	{
		const id = await this.getIdOfLogin(username);
		if (id)
		{
			//console.log("id : ", id);
			const user = await this.prismaService.chatChannelsUser.findFirst({
				where: {
					user_id: id,
					channel_id: chat_channels_id,
				}
			})
			if (user)
			{
				//console.log("user : ", user);
				await this.prismaService.chatChannelsUser.update({
					where: {
						id: user.id,
					},
					data: {
						user_role: user_role,
					}
				})
			}
		}
	}

	async RetrievePrivateMessage(login:string) {
		const id = await this.getIdOfLogin(login);
		const userDirectMessages = await this.prismaService.directMsg.findMany({
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

	async RetrieveChatMessage(chat_channels_id: number) {
			// Find the chat channel by its ID
			//console.log("prisam side chat id : ", chat_channels_id)
			const chatChannel = await this.prismaService.chatChannels.findUnique({
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
				//console.log(chatChannel.chatMessages);
				return chatChannel.chatMessages;
			}
	}

	async addChatMessage(chatChanelId: number, chat_channels_username :string, message:string, date:Date )
	{
		//console.log("chat_channels_id : ", chatChanelId);
		//console.log("chat_channels_username : ", chat_channels_username);
		//console.log("message : ", message);

		const chat_channels_user_id = await this.getIdOfChatChannelsUser(chat_channels_username, chatChanelId);
		if (chat_channels_user_id !== undefined)
		{
			//console.log("chat_channels_user_id : ", chat_channels_user_id);
			const newMessage = await this.prismaService.chatMsgHistory.create({
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
			//console.log("issue addchat mesasge.")
		}
	}

	 async addChanelUser(channel_id : number, user_id : number, user_role:string, date_joined:Date, date_left:Date | null)
	{
		//console.log("in add chanel user date receive : ", date_joined);
		//console.log("channel_id : ", channel_id);
		//console.log("user_id : ", user_id);


		if (await this.userHasChatChannelsUser(user_id, channel_id)) {
			//console.log("user already in chat");
		}
		else {
			const newMessage = await this.prismaService.chatChannelsUser.create ({
				data: {
					channel_id: channel_id,
					user_id: user_id,
					user_role: user_role,
					date_joined: date_joined,
					date_left: date_left,
					muted:false,
				}
			})
			return (newMessage.id)
		}
	}

	async getListOfChatByUsername(username: string)
	{
		const id = await this.getIdOfLogin(username);
		const userChatChannels = await this.prismaService.chatChannelsUser.findMany({
			where: {
				user_id: id,
			},
			include: {
				channel: true,
			},
		})
		return userChatChannels;
	}

	async getListOfChat()
	{
		const chatChanel = await this.prismaService.chatChannels.findMany({
			where:{
				type: "public"
			}
		})
		return chatChanel;
	}

	async getLastMessages(id:number)
	{
		const lastMessagesOfChat = await this.prismaService.chatMsgHistory.findMany({
			where:{
				chat_channels_id: id,
			},
			orderBy: {
				date_sent: 'desc',
			},
			take: 1,
			}
		)
		return lastMessagesOfChat ? lastMessagesOfChat : null;
	}

	async getOwnerOfChatAvatar(id:number)
	{
		const owner = await this.prismaService.chatChannels.findUnique({
			where:{
				id: id,
			},
			include: {
				channelOwner: true,
			},
		})
		if (owner)
		{
			return owner.channelOwner.avatar;
		}
	}


	async addPrivateMessage(sender_id: number, receiver_id: number, message: string) {
		//console.log("sender_id : ", sender_id);
		//console.log("receiver_id : ", receiver_id);
		const newMessage = await this.prismaService.directMsg.create({
			data: {
				message: message,
				sender_id: sender_id,
				receiver_id: receiver_id,
				msg_status: 'unread',
			},
		})
	}

	async findUser(chat_channels_user_id: number) {
		const user = await this.prismaService.chatChannelsUser.findUnique({
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


	async addChat(chatName: string, chatType: string, chatOwnerId: number, chatPassword: string | null) {

		const newChat = await this.prismaService.chatChannels.create({
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

	async getLastMessagesUsername(chatId: number) {
			//console.log(" chat id receive in getLastMessagesUsername : ",chatId);
			const lastMessageUsername = await this.prismaService.chatMsgHistory.findFirst({
			  where: { chat_channels_id : chatId },
			  orderBy: { date_sent: 'desc' },
			  take: 1,
			});
			if (lastMessageUsername)
			{
				const username = await this.findUser(lastMessageUsername.chat_channels_user_id);
				////console.log("last message : ", lastMessageUsername)
				return username;
			}
			return null;
	}

	//to Delete <------------
	async createUser() {
		try {
			// Check if a user with the same email exists
		const existingUser = await this.prismaService.user.findFirst({
			where: {
			email: 'johndoe@example.com', // Replace with the email you want to check
		},
		});
		if (existingUser) {
			//console.log('User already exists');
		} else {
			// User doesn't exist, create a new user
			const newUser = await this.prismaService.user.create({
				data: {
					username: 'your_username',
					first_name: 'John',
					login: 'your_login',
					last_name: 'Doe',
					email: 'johndoe@example.com',
					avatar: 'avatar_url',
					role: 'user',
					password: 'your_password',
					game_won: 0,
					game_lost: 0,
					game_played: 0,
				},
			});
			const newUser2 = await this.prismaService.user.create({
				data: {
					username: 'Pierrick',
					first_name: 'jay',
					last_name: ';avf',
					login: 'pjay',
					email: 'johndoeff@example.com',
					avatar: 'fffvvf',
					role: 'user',
					password: 'your_password',
			  game_won: 0,
			  game_lost: 0,
			  game_played: 0,
			  // Add other user fields as needed
			},
		});
		//console.log('User created:', newUser2);
		}
		} catch (error) {
			console.error('Error creating user:', error);
		} finally {
			await this.prismaService.$disconnect(); // Disconnect from the database when done
		}
	}

	async checkChatId(idSearched: number) {
		const chat = await this.prismaService.chatChannels.findFirst({
			where: {
				id: idSearched,
			},
		})
		if (chat) {
			if (chat.type === 'public')
				return ChatType.Public;
			else
			{
				if (chat.password !== null)
					return ChatType.Password;
				else
					return ChatType.Private;
			}
		}
		else{
			return ChatType.NotExisting;
		}
	}

	async checkLogin(login: string) {
		//console.log("login asked : ", login);
		const user = await this.prismaService.user.findFirst({
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

	async userHasChatChannelsUser(userId: number, channelId: number) {
		const chatChannelsUser = await this.prismaService.chatChannelsUser.findFirst({
		  where: {
			user_id: userId,
			channel_id: channelId,
		  },
		});

		return !!chatChannelsUser; // Returns true if the record exists, false if it doesn't
	  }
	//---------------------->
}
