import { PrismaClient } from '@prisma/client'
import { Injectable } from "@nestjs/common";
import e from 'express';
import { get } from 'http';


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

	async BanUserFromChannel(login: string, chatId: number)
	{
		const getId = await this.getIdOfLogin(login);
		if (getId) {
			// Fetch the ID of the record to delete based on user_id and channel_id
			const recordToDelete = await this.prismaService.chatChannelsUser.findFirst({
			  where: {
				user_id: getId,
				channel_id: chatId,
			  },
			});

			if (recordToDelete) {
			  // Use the ID to delete the record
			  console.log("record to delete id = ", recordToDelete.id);
			  const removedUser = await this.prismaService.chatChannelsUser.update({
				where: {
				  id: recordToDelete.id,
				},
				  data: {
					banned: true,
				  } // Use the ID to uniquely identify the record
			  });
			}
		}
	}

	async userHasbeenKickedInChat(user_id:number, chat_id:number) {
		const userExistInChat = await this.prismaService.chatChannelsUser.findFirst({
			where: {
			  user_id: user_id,
			  channel_id: chat_id,
			  kicked:true,
			},
		})
		if (userExistInChat)
		{
			const worked = await this.prismaService.chatChannelsUser.update({
				where: {
					id : userExistInChat.id,
				},
				data : {
					kicked : false
				}
			})
			return true;
		}
		return false;
	}

	async kickUserFromChat(login:string, chatId: number)
	{
		const getId = await this.getIdOfLogin(login);
		if (getId) {
			// Fetch the ID of the record to delete based on user_id and channel_id
			const recordToDelete = await this.prismaService.chatChannelsUser.findFirst({
			  where: {
				user_id: getId,
				channel_id: chatId,
			  },
			});

			if (recordToDelete) {
			  // Use the ID to delete the record
			  console.log("record to delete id = ", recordToDelete.id);
			  const removedUser = await this.prismaService.chatChannelsUser.update({
				where: {
				  id: recordToDelete.id,
				},
				  data: {
					kicked: true,
				  } // Use the ID to uniquely identify the record
			  });
			  if (removedUser)
			  	return true;
			}
			return false;
		}
		return false;
	}

	async banUserPrism(login: string, chatId : number)
	{
		const getId = await this.getIdOfLogin(login);
		if (getId && ! await this.checkIfUserIsBanned(chatId, login))
		{
			const banned = await this.prismaService.usersBannedToChats.create({
				data: {
					userId :getId,
					chatId : chatId,
				}
			})
			if (banned)
			{
				await this.BanUserFromChannel(login, chatId);
				return true;
			}
		}
		return false;
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

	async checkIfUserIsBanned(chat_channels_id: number, username: string)
	{
		console.log("hey what did i recerive : ", chat_channels_id, username);
		const user_id = await this.getIdOfLogin(username);
		if (user_id)
		{
			const isBanned = await this.prismaService.usersBannedToChats.findFirst({
				where: {
					userId: user_id,
					chatId: chat_channels_id,
				}
			})
			console.log("isBanned = ", isBanned);
			if (isBanned)
				return true;
			else
				return false;
		}
		return false;
	}

	async getIdOfChatChannelsUser(login: string, chat_channels_id: number){
		const idOfUser = await this.getIdOfLogin(login);

		const user = await this.prismaService.chatChannelsUser.findFirst({
			where: {
				user_id: idOfUser,
				channel_id: chat_channels_id,
			}
		})
		if (user)
		{

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

			const user = await this.prismaService.chatChannelsUser.findFirst({
				where: {
					user_id: id,
					channel_id: chat_channels_id,
				}
			})
			if (user)
			{

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

	async isOwner(usermame : string, chatId: number)
	{
		const heIsOwner = await this.prismaService.chatChannels.findUnique({
			where: {
				id: chatId,
			  },
			  select: {
				channelOwner: {
				  select: {
					username: true,
				  },
				},
			  },
			});
		console.log("heisowner = ", heIsOwner);
		if (!heIsOwner)
			return false;
		return heIsOwner.channelOwner.username === usermame
	}

	async isAdmin(login:string, chatId:number)
	{
		const idToLogin = await this.getIdOfLogin(login);
		if (idToLogin)
		{
			const heIsAdmin = await this.prismaService.chatChannelsUser.findFirst({
				where: {
					channel_id: chatId,
					user_id: idToLogin,
				  },
				});
			console.log("heisAdmin = ", heIsAdmin);
			if (!heIsAdmin)
				return false;
			if (heIsAdmin.user_role == "admin")
				return true;
		}
		return false;
	}

	// async RetrievePrivateMessage(login:string) {
	// 	const id = await this.getIdOfLogin(login);
	// 	if (id)
	// 	{
	// 		const userDirectMessages = await this.prismaService.directMsg.findUnique({
	// 			where: {
	// 			  OR: [
	// 				{ sender_id: id},    // Messages where the user is the sender
	// 				{ receiver_id: id},  // Messages where the user is the receiver
	// 			  ],
	// 			},
	// 			include: {
	// 			  sender: true,
	// 			  receiver: true,
	// 			},
	// 		  });
	// 		return userDirectMessages;
	// 	}
	// }

	async RetrieveChatMessage(chat_channels_id: number) {
			// Find the chat channel by its ID

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

				return chatChannel.chatMessages;
			}
	}

	async addChatMessage(chatChanelId: number, chat_channels_username :string, message:string, date:Date, serviceMessage: boolean )
	{
		const chat_channels_user_id = await this.getIdOfChatChannelsUser(chat_channels_username, chatChanelId);
		if (chat_channels_user_id !== undefined)
		{

			const newMessage = await this.prismaService.chatMsgHistory.create({
				data: {
					date_sent: date,
					message: message,
					chat_channels_id: chatChanelId,
					chat_channels_user_id: chat_channels_user_id,
					serviceMessage: serviceMessage,
				},
			})
		}
		else
		{

		}
	}

	 async addChanelUser(channel_id : number, user_id : number, user_role:string, date_joined:Date, date_left:Date | null)
	{
		if (await this.userHasChatChannelsUser(user_id, channel_id)) {

		}
		else {
			const newMessage = await this.prismaService.chatChannelsUser.create ({
				data: {
					channel_id: channel_id,
					user_id: user_id,
					user_role: user_role,
					date_joined: date_joined,
					date_left: date_left,
					kicked: false,
					banned: false,
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
				banned: false,
				kicked:false,
			},
			include: {
				channel: true,
			},
		})
		return userChatChannels;
	}

	async getListOfChat()
	{
		//ajouter les password protected
		const chatChanel = await this.prismaService.chatChannels.findMany({
			where:{
				type: {
					in: ["public", "protected by password"],
				  },
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
		console.log("id =  ", id);
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

	async addDmChat(chatName: string, chatType: string, chatOwnerId: number)
	{
		const alreadyIn = await this.prismaService.chatChannels.findFirst({
			where: {
				type: chatType,
				name: chatName,
			}
		})
		if (!alreadyIn)
		{
			const newChat = await this.prismaService.chatChannels.create({
				data: {
					type: chatType,
					name: chatName,
					password: null,
					channelOwner: {
						connect: { id: chatOwnerId }
					}
				}
			})
			return newChat.id;
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

			const lastMessageUsername = await this.prismaService.chatMsgHistory.findFirst({
			  where: { chat_channels_id : chatId },
			  orderBy: { date_sent: 'desc' },
			  take: 1,
			});
			if (lastMessageUsername)
			{
				const username = await this.findUser(lastMessageUsername.chat_channels_user_id);

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

		} else {
			// User doesn't exist, create a new user
			const newUser = await this.prismaService.user.create({
				data: {
					username: 'your_username',
					first_name: 'John',
					login: 'your_username',
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
					login: 'Pierrick',
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
