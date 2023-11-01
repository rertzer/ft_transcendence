import { Injectable, Global } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";

@Global()
@Injectable()
export class MutedUserService {
  mutedUsers: MutedUser[] = [];

  constructor(private prismaService: PrismaChatService) {
	//console.log("create an array of muted user")
  }

  async addMutedUser(user: MutedUser) {
	const isMutted = this.IsMutedUser(user.username, user.chatId)
	const isOwner = await this.prismaService.isOwner(user.username, user.chatId)
	if (isMutted || isOwner)
	{
		console.log("owner")
		//console.log("stop force mute")
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
	//console.log("username i receive = ", username, "chatId i receive = ", chatId);
	//console.log("all muted user = ", this.mutedUsers);
	const isMutted =  this.mutedUsers.find((user) => user.username === username && user.chatId === chatId);

	//console.log("is muteeddd : ", isMutted)
		if (isMutted !== undefined)
		{
			const time = new Date();
			time.setHours(time.getHours() + 1);
			const timeStart = isMutted.timeStart;
			const timeDiff = Math.abs(time.getTime() - timeStart.getTime());
			//console.log("time start of mutted duration = ", timeDiff);
			//console.log("Is mutted duration : ", isMutted.duration)
			if (timeDiff >= (isMutted.duration * 1000))
			{
				//console.log("LLLLLLLL---------user unmuted------------llllllllllll");
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
