import { Socket } from "socket.io";

export interface Player {
	upArrowDown:boolean;
	downArrowDown:boolean;
	name:string;
	socket: Socket;
}