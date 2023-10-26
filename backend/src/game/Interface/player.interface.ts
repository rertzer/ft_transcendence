import { Socket } from "socket.io";
import { Room } from "./room.interface";

export interface Player {
	upArrowDown:boolean;
	downArrowDown:boolean;
	name:string;
	socket: Socket;
	readyToPlay:boolean;
	room:Room | null;
}