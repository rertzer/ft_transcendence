import { ConnectedSocket, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Server, Socket } from "socket.io";
import { PlayersService } from "./players/players.service";
import { Inject } from "@nestjs/common";
import { RoomsService } from "./rooms/rooms.service";
import { Interval } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
    namespace: '/game_socket',
	cors: {
        origin: 'http://localhost:3000',
    },
	
})
export class GameSocketEvents  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	
	private readonly logger = new Logger(GameSocketEvents.name);

	@Inject(PlayersService)
	private readonly playersService: PlayersService;

	@Inject(RoomsService)
	private readonly roomsService: RoomsService;

	@WebSocketServer()
	server: Namespace;

	//Connexion 
	handleConnection(client:Socket){
		console.log(`GameSocket Client connected: ${client.id}`);
		this.playersService.create({
			upArrowDown:false,
			downArrowDown:false,
			name:'', 
			readyToPlay:false,
			socket: client, 
			room:null
		});
    }
	//Deconnexion 
	handleDisconnect(client: Socket) {
		console.log(`Client disconnected ${client.id}`);
		const player = this.playersService.findOne(client);
		if (player) this.roomsService.removePlayerFromRoom(player);
		this.playersService.remove(client);	
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

	@Interval(1000/60)
	handleInterval() {
		this.roomsService.playGameLoop()
		this.roomsService.broadcastGameState();
	};

	afterInit(): void {
		this.logger.log('Game Socket Gateway initialised')
	}
}

/* Besoin d'envoyer au front les parametres du jeu quand il se connecte pour la premiere fois */