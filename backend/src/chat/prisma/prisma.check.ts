import { prismaService } from "./prisma.test";

export enum ChatType {
	NotExisting = -1,
	Public = 0,
	Private = 1,
	Password = 2,

}
export async function checkChatId(idSearched: number) {
	const chat = await prismaService.chatChannels.findFirst({
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

export async function userHasChatChannelsUser(userId: number, channelId: number) {
	const chatChannelsUser = await prismaService.chatChannelsUser.findFirst({
	  where: {
		user_id: userId,
		channel_id: channelId,
	  },
	});

	return !!chatChannelsUser; // Returns true if the record exists, false if it doesn't
  }
