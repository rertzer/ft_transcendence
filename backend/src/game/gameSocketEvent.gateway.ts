import { ConnectedSocket, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Server, Socket } from "socket.io";
import { PlayersService } from "./players/players.service";
import { Inject } from "@nestjs/common";
import { RoomsService } from "./rooms/rooms.service";
import { Interval } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";
import { TypeGame } from "./Interface/room.interface";

@WebSocketGateway({
    namespace: '/game_socket',
	cors: {
        origin: '*',
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
			name:'',
			posY: 0.5,
			readyToPlay:false,
			socket: client, 
			room:null,
			idPlayerMove:-1
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
	@SubscribeMessage('give_me_a_room')
	handleGiveMeARoom(@MessageBody() data:{typeGame:TypeGame}, @ConnectedSocket() client:Socket){
		const newRoomId = this.roomsService.createEmptyRoom(data.typeGame);
		const responseData = {
			roomId:newRoomId
		}
		client.emit('new_empty_room', responseData);
	}

	@SubscribeMessage('match_me')
	handleJoinWaitingRoom(@MessageBody() data:{playerName:string, typeGame:TypeGame}, @ConnectedSocket() client:Socket){
		const player = this.playersService.findOne(client);
		if (player) {
			this.playersService.changePlayerName(player, data.playerName);
			this.roomsService.joinWaitingRoom(player, data.typeGame);
		} 
	}

	@SubscribeMessage('join_game')
	handleJoinGame(@MessageBody() data:{roomId:number, playerName:string}, @ConnectedSocket() client:Socket){
		const player = this.playersService.findOne(client);
		if (player) {
			this.playersService.changePlayerName(player, data.playerName);
			this.roomsService.addPlayerToRoom(player, data.roomId);
		} 
	}
	@SubscribeMessage('keyevent')
	handlePlayerKeyEvent(@MessageBody() data:{key:string, idPlayerMove:number}, @ConnectedSocket() client:Socket){
		const room = this.roomsService.findRoomOfPlayerBySocket(client)
		if (room) {
			this.roomsService.movePlayerOnEvent({room, key:data.key, idPlayerMove:data.idPlayerMove, client});
		}
	}

	

	@Interval(1000/60)
	handleInterval() {
		this.roomsService.playGameLoop();
		this.roomsService.broadcastGameState();
	};

	afterInit(): void {
		this.logger.log('Game Socket Gateway initialised')
	}
}

/* Besoin d'envoyer au front les parametres du jeu quand il se connecte pour la premiere fois */