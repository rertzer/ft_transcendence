import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PlayersService } from "../players/players.service";
import { Inject } from "@nestjs/common";
import { RoomsService } from "../rooms/rooms.service";
import { Interval, SchedulerRegistry } from "@nestjs/schedule";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameSocketEvents {
	//constructor(private schedulerRegistry: SchedulerRegistry) {}

	@Inject(PlayersService)
	private readonly playersService: PlayersService;

	@Inject(RoomsService)
	private readonly roomsService: RoomsService;

	@WebSocketServer()
	server: Server;
	
	/*private roomStatusInterval = setInterval(() => {this.roomsService.broadcastRoomsStatus();
		console.log('handleInterval');}, 10);*/

	//Connexion 
	handleConnection(client:Socket){
		console.log(`Client connected: ${client.id}`);
		this.playersService.create({
			upArrowDown:false,
			downArrowDown:false,
			name:'', 
			readyToPlay:false,
			socket: client});
		client.on('disconnect', () => {
			console.log(`Client disconnected ${client.id}`);
			const player = this.playersService.findOne(client);
			if (player) this.roomsService.removePlayerFromRoom(player);
			this.playersService.remove(client);
		})
    }

    //Recevoir un event 
	@SubscribeMessage('join_game')
	handleJoinGame(@MessageBody() data:{roomName:string, playerName:string}, @ConnectedSocket() client:Socket){
		const player = this.playersService.findOne(client);
		if (player) {
			this.playersService.changePlayerName(player, data.playerName);
			this.roomsService.addPlayerToRoom(player, data.roomName);
		} 
	}
	@SubscribeMessage('keyevent')
	handlePlayerKeyEvent(@MessageBody() data:{move:boolean, key:string}, @ConnectedSocket() client:Socket){
		const player = this.playersService.findOne(client);
		if (player) {
			this.playersService.processPlayerKeyEvent({socket:client, key: data.key, move:data.move});
		}
	}

	@Interval(15)
	handleInterval() {
		this.roomsService.playGameLoop()
		this.roomsService.broadcastGameState();
	};
}

/* Besoin d'envoyer au front les parametres du jeu quand il se connecte pour la premiere fois */