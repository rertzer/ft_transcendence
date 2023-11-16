import { Socket } from "socket.io";
import { Room } from "./room.interface";

export interface Player {
	posY:number;
	name:string;
	socket: Socket;
	readyToPlay:boolean;
	room:Room | null;
	idPlayerMove:number;
}