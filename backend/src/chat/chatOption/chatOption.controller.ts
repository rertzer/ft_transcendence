import { Body, Controller, Post, Get } from "@nestjs/common";
import { changeChatUserRole } from "src/prisma/chat/prisma.chat.service";
import { MutedUserService } from "../mutedUser/mutedUser.service";
import { getDate } from "../utils/utils.service";


@Controller('chatOption')
export class AdminController {
	constructor(private mutedUserService: MutedUserService) {}

	@Post('/setAdmin')
	async setUserAsAdmin(@Body() user:{username:string, chatId: number}){
		await changeChatUserRole(user.chatId, user.username, "admin");
	}

	@Post('muteUser')
	async muteUser(@Body() user:{username:string, chatId: number, time: number}){
		this.mutedUserService.addMutedUser({username: user.username, chatId: user.chatId, timeStart: getDate(), duration: user.time});
	}

	@Post('banUser')
	async banUser(@Body() user:{username:string, chatId: number}){

	}

	@Post('kickUser')
	async kickUser(@Body() user:{username:string, chatId: number}){

	}


}
