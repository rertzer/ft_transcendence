import { Socket } from "socket.io";

export interface Player {
	posY: number;
	score: number;
	side: string;
	upArrowDown:boolean;
	downArrowDown:boolean;
	name:string;
	socket: Socket;
}