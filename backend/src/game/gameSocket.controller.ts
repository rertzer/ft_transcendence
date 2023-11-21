import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { TypeGame } from "./Interface/room.interface";
import { JwtGuard } from '../auth/guard';
import { UseGuards } from "@nestjs/common";
import { RoomsService } from "./rooms/rooms.service";

//@UseGuards(JwtGuard)
@Controller('game')
export class gameSocketControler {
	constructor(private roomsService: RoomsService){}

	@Post('newRoom')
	giveMeARoom(@Body() data:{typeGame: TypeGame})
	{		
		const newRoomId = this.roomsService.createEmptyRoom(data.typeGame);
		const responseData = {
			roomId:newRoomId?.id
		}
		return (responseData);	
	}	
}
