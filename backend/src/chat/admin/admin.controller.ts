import { Body, Controller, Post, Get } from "@nestjs/common";
import { changeChatUserRole } from "src/prisma/chat/prisma.chat.service";



@Controller('setAdmin')
export class AdminController {
	constructor() {}

	@Post()
	async setUserAsAdmin(@Body() user:{username:string, chatId: number}){
		console.log("yo i am here, here is what i received: ", user.username, user.chatId);
		await changeChatUserRole(user.chatId, user.username, "admin");
	}

}
