import { prismaService } from "./prisma.test";

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

export async function userHasChatChannelsUser(userId: number, channelId: number) {
	const chatChannelsUser = await prismaService.chatChannelsUser.findFirst({
	  where: {
		user_id: userId,
		channel_id: channelId,
	  },
	});

	return !!chatChannelsUser; // Returns true if the record exists, false if it doesn't
  }
