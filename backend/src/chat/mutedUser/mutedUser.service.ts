import { Injectable, Global } from "@nestjs/common";

@Global()
@Injectable()
export class MutedUserService {
  mutedUsers: MutedUser[] = [];

  constructor() {
	console.log("create an array of muted user")
  }

  addMutedUser(user: MutedUser) {
	console.log("in add muted user : ", user)
    this.mutedUsers.push(user);
	console.log("MutedUser === ", this.mutedUsers);
  }

  removeMutedUser(username: string, chatId: number) {
    this.mutedUsers = this.mutedUsers.filter((user) => !(user.username === username && user.chatId === chatId));
  }

  IsMutedUser(username: string, chatId: number): boolean {
	console.log("username i receive = ", username, "chatId i receive = ", chatId);
	console.log("all muted user = ", this.mutedUsers);
	const isMutted =  this.mutedUsers.find((user) => user.username === username && user.chatId === chatId);

	console.log("is muteeddd : ", isMutted)
	if (isMutted)
	{
		if (isMutted !== undefined)
		{
			const time = new Date();
			const timeStart = isMutted.timeStart;
			const timeDiff = Math.abs(time.getTime() - timeStart.getTime());
			const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			console.log("time start of mutted duration = ", timeStart, "time diff = ", timeDiff);
			if (diffDays >= isMutted.duration)
			{
				this.removeMutedUser(username, chatId);
				return false;
			}
			return true;
		}
	}

	return false;
}

  getMutedUsers(chatId: number): MutedUser[] {
    return this.mutedUsers.filter((user) => user.chatId === chatId);
  }
}
