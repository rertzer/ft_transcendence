import { Socket } from "socket.io";

export class PlayerDto {
	posY: number;
	score: number;
	side: string;
	upArrowDown:boolean;
	downArrowDown:boolean;
	name:string;
	socket: Socket;
}