import { Injectable } from '@nestjs/common';
import { Room, TypeGame} from '../Interface/room.interface';
import { Player } from '../Interface/player.interface';
import { Socket } from 'socket.io';
import { PrismaGameService } from 'src/prisma/game/prisma.game.service';
import { GameService } from './game.service';
import { OnModuleInit } from '@nestjs/common';
import { gameMaps } from '../DefaultData/gameMaps';
import { gameParams } from '../DefaultData/gameParams';
import { IgameMaps } from '../Interface/gameMaps.interface';
import { IgameParams } from '../Interface/gameParam.interface';

@Injectable()
export class RoomsService  implements OnModuleInit{
	constructor(private prismaService: PrismaGameService, private gameService: GameService){}

	private rooms: Room[] = [];
	private roomMaxId:number = 1;
	private gameParams: GameParams[]= [];
	private waitingRoomBasic: Player | null = null;
	private waitingRoomAdvanced: Player | null = null;
	private gameMaps:GameMaps[] = [];
	private gameObstacles: GameObstacles[];

	async onModuleInit() {
		await this.prismaService.initDB().then(async () => await this.loadDBdata());	
	} 

	async loadDBdata() {
		this.gameParams = await this.prismaService.gameParams.findMany();
		this.gameMaps = await this.prismaService.gameMaps.findMany();
		this.gameObstacles = await this.prismaService.gameObstacles.findMany();
	}

	displayInfo() {
		console.log("-------------------------------------------------");
		console.log("-------------     DISPLAY INFO     --------------");
		console.log("-------------------------------------------------");
		console.log("gameParams : ", gameParams);
		console.log("gameMaps : ", gameMaps);
		console.log("this.rooms : ", this.rooms);
	}

	/** 
	 * I faut que je recupere les maps etc de la base de donne au lancement du module et je ne refais plus 
	 * d'acces a la BDD par la suite. 
	 * Pour eviter d'avoir des trucs async sur les fonctions de room. 
	 * 
	 * 
	 * La fonction addplayertoroom ne marche pas. A revoir car il trouve pas la room. 
	 * 
	*/

	createRoom(playerLeft:Player, playerRight:Player, typeGame:TypeGame) {
		console.log("\x1b[33mJe rentre dans createRoom\x1b[0m")
		const room = this.createEmptyRoom(typeGame);
		if (!room) return null; 
		room.gameStatus = 'WAITING_TO_START';
		room.playerLeft = playerLeft;
		room.playerRight = playerRight;
		console.log('JE VIENS DE FAIRE UNE ROOM', room);
		room.playerLeft.socket.emit('room_joined', {roomId: room.id});
		room.playerRight.socket.emit('room_joined', {roomId: room.id});
		return (room);
	};

	createEmptyRoom(typeGame:TypeGame) : Room | null {
		console.log("\x1b[33mJe rentre dans createEmptyRoom\x1b[0m");
		const gameParam = gameParams.find((gp) => {return (gp.type === typeGame)});
		if (typeof(gameParam) === 'undefined')  {
			console.log("\x1b[31m Attetion, j'ai pas ete capabe de trouver les game Params\x1b[0m");
			return null
		};
		const newRoom: Room = {
			id:this.roomMaxId,
			balls: [],
			obstacles: [],
			ballHasLeft: false,
			playerLeft:null,
			playerRight:null,
			scoreLeft:0,
			scoreRight:0,
			gameStatus:'WAITING_FOR_PLAYER', 
			createdOn: new Date(),
			finishOn: null,
			startingCountDownStart: null,
			startingCount: 0,
			bddGameId:0,
			typeGame:typeGame,
			gameParam: gameParam
		}
		this.roomMaxId++;
		if (newRoom.typeGame === 'ADVANCED' && gameMaps.length) {
			const map = gameMaps[Math.floor(Math.random() * gameMaps.length)];
			newRoom.obstacles = map.obstacles;
			newRoom.balls = this.gameService.newBalls(map.nbBalls, newRoom);
		}
		else {
			newRoom.balls = this.gameService.newBalls(1, newRoom);
		}
		this.rooms.push(newRoom);
		return (newRoom);
	}; 

	joinWaitingRoom(player:Player, typeGame:TypeGame) {
		const waitingPlayer = (typeGame === 'ADVANCED' ? this.waitingRoomAdvanced : this.waitingRoomBasic);
		if (waitingPlayer === null) {
			console.log('I am adding', player.name , 'to the waiting list for', typeGame)
			if (typeGame === 'ADVANCED') {
				this.waitingRoomAdvanced = player;
			} 
			else {
				this.waitingRoomBasic = player;
			}
			player.socket.emit('waiting_room_joined');
		}
		else {
			console.log('The waiting room is not vide')
			this.createRoom(waitingPlayer, player, typeGame);
			if (typeGame === 'ADVANCED') {
				this.waitingRoomAdvanced = null;
			}
			else {
				this.waitingRoomBasic = null;
			}
		}
	}

	removeRoom(room: Room) {
		this.rooms = this.rooms.filter((r) => {return r != room;});
		console.log('Remove room');
		console.log('Rooms :', this.rooms);
	};

	getAllRoom(): Room[] {
		return this.rooms;
	};

	findRoomsOfPlayer(player: Player | null): Room[] | null {
		if (!player) return null;
		const room = this.rooms.filter((element) => {return(element.playerLeft === player || element.playerRight === player)});
		if (room.length === 0) {
			return null;
		}
		return room;
	};
	
	findRoomOfPlayerBySocket(socket: Socket): Room | null {
		const room = this.rooms.find((element) => (element.playerLeft?.socket === socket || element.playerRight?.socket === socket));
		if (typeof(room) === 'undefined') {
			return null;
		}
		return room;
	};

	findRoomById(idToFind:number) : Room | null {
		const room = this.rooms.filter((element) => {return (element.id === idToFind)});
		if (typeof(room) === 'undefined' || room.length === 0) {
			return null;
		}
		return room[0];
	};

	async addPlayerToRoom(player:Player, roomId:number) {
		
		let room = this.findRoomById(roomId);
		if (room === null) return;  
		console.log('toto');
		if (room.playerLeft === player || room.playerRight === player) {
			player.socket.emit('error_join', {roomId: room.id, errorMsg: 'Player already in room'});
			return;
		}
		if (room.playerLeft != null  && room.playerRight != null) {
			player.socket.emit('error_join', {roomId: room.id, errorMsg: 'The Room is full'});
			return;
		}
		if (room.playerLeft === null) {
			room.playerLeft = player;
		}
		else {
			room.playerRight = player;
		}
		player.room = room;
		room.gameStatus = 'WAITING_TO_START';
		console.log('Creating a new reccord on the BDD');
		const roomToUpdate = room;
		const bddGame = await this.prismaService.addNewGame(room).then(
			(bddGame) => {
				if (bddGame) {
					roomToUpdate.bddGameId = bddGame.id;
				}
			}
		);
		console.log('Player ', player.socket.id, ' added to Room ', room.id);
		
		player.socket.emit('room_joined', {roomId: room.id});
	};

	getNumberOfPlayersInRoom(room:Room):number {
		if (room.playerLeft === null && room.playerRight === null) return 0;
		if (room.playerLeft === null || room.playerRight === null) return 1;
		return 2;
	};

	getSideOfPlayer(room:Room, player:Player):string {
		if (player === room.playerLeft) return 'left';
		if (player === room.playerRight) return 'right';
		else return 'none';
	};

	async removePlayerFromRoom(player:Player, roomId:number) {
		let room = this.findRoomById(roomId);
		if (room === null || (room.playerLeft !== player && room.playerRight !== player)) return ;
		if (this.getNumberOfPlayersInRoom(room) != 2){
			this.removeRoom(room);
		}
		if (room.gameStatus !== 'FINISHED') {
			room.gameStatus = 'FINISH_BY_FORFAIT';
			this.prismaService.finishGame(room, player);
			room.playerLeft = (room.playerLeft === player ? null : room.playerLeft);
			room.playerRight = (room.playerRight === player ? null : room.playerRight)
		}
		this.sendRoomStatus(room);
	};

	sendRoomStatus(room: Room) {
		const data_to_send = {
			idRoom:room.id,
			gameParam: {
				ballRadius: room.gameParam.ballRadius,
				paddleWidth: room.gameParam.paddleWidth,
				paddleHeight: room.gameParam.paddleHeight,
				paddleSpeed: room.gameParam.paddleSpeed,
				goal: room.gameParam.goal,
			},
			playerLeft:{
				name:room.playerLeft?.name,
				socketId: room.playerLeft?.socket.id,
			},
			playerRight:{
				name:room.playerRight?.name,
				socketId: room.playerRight?.socket.id,
			},
			balls:room.balls,
			obstacles:room.obstacles,
			gameStatus:room.gameStatus
		};
		if (room.playerLeft) {console.log("\x1b[33mJ'envie les infos sur la room a ", room.playerLeft.name,"\x1b[0m")}
		room.playerLeft?.socket.emit('room_status', data_to_send);
		room.playerRight?.socket.emit('room_status', data_to_send);
	}

	broadcastGameState() {
		this.rooms.forEach(room => {
			const data = {
				balls:room.balls,
				obstacles:room.obstacles,
				playerLeft:{
					name:room.playerLeft?.name,
					posY:room.playerLeft?.posY,
					socket_id: room.playerLeft?.socket.id,
					readyToPlay:room.playerLeft?.readyToPlay,
					idPlayerMove:room.playerLeft?.idPlayerMove
				},
				playerRight:{
					name:room.playerRight?.name,
					posY:room.playerRight?.posY,
					socket_id: room.playerRight?.socket.id,
					readyToPlay:room.playerRight?.readyToPlay,
					idPlayerMove:room.playerRight?.idPlayerMove
				},
				scoreLeft:room.scoreLeft, 
				scoreRight:room.scoreRight,
				gameStatus:room.gameStatus,
				startingCount: room.startingCount
			};
			room.playerLeft?.socket.emit('game_state', data);
			room.playerRight?.socket.emit('game_state', data);
		});
	}

	playGameLoop() {
		const newRooms: Room[] = this.rooms.map((room) => {
			room = this.gameService.updateRoomGameStatus(room);
			room = this.gameService.moveBalls(room);
			room = this.gameService.checkballsPositions(room);
			return (room);
		});
		this.rooms = newRooms;
	}

	handlePlayerKeyEvent(data:{roomId: number, key:string, idPlayerMove:number, client:Socket}){
		const room = this.findRoomById(data.roomId)
		if (room) {
			this.gameService.movePlayerOnEvent({room, key:data.key, idPlayerMove:data.idPlayerMove, client:data.client});
		}
	}

}
