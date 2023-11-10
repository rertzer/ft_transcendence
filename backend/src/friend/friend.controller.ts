import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { PrismaFriendService } from "src/prisma/friend/prisma.friend.service";
@Controller('addFriend')
export class addFriendController {
	constructor(private prismaFriendService: PrismaFriendService)
	{

	}
}
