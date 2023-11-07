import { Injectable, Global } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";

@Global()
@Injectable()
export class MutedUserService {
  mutedUsers: MutedUser[] = [];

  constructor(private prismaService: PrismaChatService) {

  }

  async addMutedUser(user: MutedUser) {
	const isMutted = this.IsMutedUser(user.username, user.chatId)
	const isOwner = await this.prismaService.isOwner(user.username, user.chatId)
	if (isMutted || isOwner)
	{
		return (false);
	}
	else
	{
    	this.mutedUsers.push(user);
		return (true)
	}
  }

  removeMutedUser(username: string, chatId: number) {
    this.mutedUsers = this.mutedUsers.filter((user) => !(user.username === username && user.chatId === chatId));

}

  IsMutedUser(username: string, chatId: number): boolean {
	const isMutted =  this.mutedUsers.find((user) => user.username === username && user.chatId === chatId);

		if (isMutted !== undefined)
		{
			const time = new Date();
			time.setHours(time.getHours() + 1);
			const timeStart = isMutted.timeStart;
			const timeDiff = Math.abs(time.getTime() - timeStart.getTime());
			if (timeDiff >= (isMutted.duration * 1000))
			{
				this.removeMutedUser(username, chatId);
				return false;
			}
			return true;
		}
	return false;
}

  getMutedUsers(chatId: number): MutedUser[] {
    return this.mutedUsers.filter((user) => user.chatId === chatId);
  }
}
