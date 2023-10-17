import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

export class SocketService {
	public connectToGameRoom (data:{roomId:string, playerName:string}, client:Socket) {

	} 
}