import { Injectable, OnModuleInit } from "@nestjs/common";
import { io, Socket } from "socket.io-client";

@Injectable()
export class SocketClient implements OnModuleInit{
	public socketClient: Socket;

	constructor() {
		this.socketClient = io('http://localhost:9001');
	}

	onModuleInit() {
		this.registerConsumerEvents();
	}
	private registerConsumerEvents() {
		this.socketClient.emit('newMessage', {msg: 'Ceci est un test', username: "pierrick"})
		console.log('client side');
		this.socketClient.on('connect', () => {
			console.log('connecto to gateway');
		});
		this.socketClient.on('onMessage', (payload: any) => {
			console.log(payload);
		})
	}
}
