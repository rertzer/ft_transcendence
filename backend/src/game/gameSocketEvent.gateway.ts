import { ConnectedSocket, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Server, Socket } from "socket.io";
import { PlayersService } from "./players/players.service";
import { Inject } from "@nestjs/common";
import { RoomsService } from "./rooms/rooms.service";
import { Interval } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";
import { TypeGame } from "./Interface/room.interface";
import { GameLogicService } from "./gameLogic/gameLogic.service";
import { PrismaGameService } from "src/prisma/game/prisma.game.service";

@WebSocketGateway({
	namespace: '/game_socket',
	cors: {
		origin: 'http://' + process.env.REACT_APP_URL_MACHINE + ':4000/game_socket'
	},
	methods: ["GET", "POST"],
    credentials: true,
})

export class GameSocketEvents  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	
	private readonly logger = new Logger(GameSocketEvents.name);
	private printEventRecieved:boolean = true;

	@Inject(PlayersService)
	private readonly playersService: PlayersService;

	@Inject(PrismaGameService)
	private readonly prismaGameService: PrismaGameService;

	@Inject(RoomsService)
	private readonly roomsService: RoomsService;

	@Inject(RoomsService)
	private readonly gameService: GameLogicService;

	@WebSocketServer()
	server: Namespace; 

	//Connexion 
	handleConnection(client:Socket){
		if (this.printEventRecieved) console.log(`GameSocket Client connected: ${client.id}`);
		this.playersService.create({
			name:'',
			roomState:[],
			socket: client,
			idBdd:-1
		});
    }

	handleDisconnect(client: Socket) {
		if (this.printEventRecieved) console.log(`GameSocket Client disconnected ${client.id}`);
		const player = this.playersService.findOne(client);
		if (player) {
			const rooms_player = this.roomsService.findRoomsOfPlayer(player);
			rooms_player?.forEach((room) => {
				this.roomsService.removePlayerFromRoom(player,room.id);
			});
			this.roomsService.removePlayerFromWaitingRooms(player);
		};
		this.playersService.remove(client);	
	}

    //Recevoir un event 
	@SubscribeMessage('give_me_a_room')
	async handleGiveMeARoom(@MessageBody() data:{typeGame:TypeGame}, @ConnectedSocket() client:Socket){
		if (this.printEventRecieved) console.log('give_me_a_room');
		const newRoomId = await this.roomsService.createEmptyRoom(data.typeGame);
		const responseData = {
			roomId:newRoomId?.id
		}
		client.emit('new_empty_room', responseData);
	}

	@SubscribeMessage('match_me')
	async handleJoinWaitingRoom(@MessageBody() data:{playerName:string, typeGame:TypeGame}, @ConnectedSocket() client:Socket){
		if (this.printEventRecieved) console.log('match_me');
		const player = this.playersService.findOne(client);
		if (player) {
			player.name = data.playerName;
			player.idBdd = await this.prismaGameService.getIdOfLogin(data.playerName);
			this.roomsService.joinWaitingRoom(player, data.typeGame);
		} 
	}

	@SubscribeMessage('join_room')
	async handleJoinGame(@MessageBody() data:{roomId:number, playerName:string}, @ConnectedSocket() client:Socket){
		if (this.printEventRecieved) console.log('join_room');
		const player = this.playersService.findOne(client);
		if (player) {
			player.name = data.playerName;
			player.idBdd = await this.prismaGameService.getIdOfLogin(data.playerName);
			this.roomsService.addPlayerToRoom(player, data.roomId);
		}
	}

	@SubscribeMessage('give_me_room_status')
	handleGiveMeRoomStatus(@MessageBody() data:{roomId:number}, @ConnectedSocket() client:Socket){
		if (this.printEventRecieved) console.log('give_me_room_status');
		const room = this.roomsService.findRoomById(data.roomId);
		if (room) this.roomsService.sendRoomStatus(room);
	}

	@SubscribeMessage('keyevent')
	handlePlayerKeyEvent(@MessageBody() data:{roomId:number, key:string, idPlayerMove:number}, @ConnectedSocket() client:Socket){
		if (this.printEventRecieved) console.log('keyevent');
		this.roomsService.handlePlayerKeyEvent({roomId: data.roomId, key:data.key, idPlayerMove:data.idPlayerMove, client});
	}

	@SubscribeMessage('i_am_leaving')
	handleLeaving(@MessageBody() data:{waitingRoom:boolean, modeGame:TypeGame,  roomId:number}, @ConnectedSocket() client:Socket){
		if (this.printEventRecieved) console.log('i_am_leaving');
		const player = this.playersService.findOne(client);
		if (player && data.waitingRoom){
			if (data.modeGame === 'ADVANCED') {
				this.roomsService.removePlayerFromAdvancedWaitingRoom(player)
			};
			if (data.modeGame === 'BASIC') {
				this.roomsService.removePlayerFromBasicWaitingRoom(player)
			};
		}
		else if (player) {
			const room = this.roomsService.findRoomById(data.roomId);
			player.roomState = player.roomState.filter(rs => {return (rs.room !== room)});
			this.roomsService.removePlayerFromRoom(player, data.roomId);
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
