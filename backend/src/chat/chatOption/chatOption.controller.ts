import { Body, Controller, Post, Get } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { MutedUserService } from "../mutedUser/mutedUser.service";
import { getDate } from "../utils/utils.service";


@Controller('chatOption')
export class ChatOptController {
	constructor(private readonly mutedUserService: MutedUserService, private prismaService:PrismaChatService) {}

	@Post('setAdmin')
	async setUserAsAdmin(@Body() user:{username:string, chatId: number}){
		await this.prismaService.changeChatUserRole(user.chatId, user.username, "admin");
	}

	@Post('banUser')
	async banUser(@Body() user:{username:string, chatId: number}){

	}

	@Post('kickUser')
	async kickUser(@Body() user:{username:string, chatId: number}){

	}
}
