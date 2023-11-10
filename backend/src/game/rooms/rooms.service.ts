import { Injectable } from '@nestjs/common';
import { Room, TypeGame} from '../Interface/room.interface';
import { Player } from '../Interface/player.interface';
import { Ball } from '../Interface/ball.interface';
import { IGameParamBackEnd } from '../Interface/gameparam.interface';
import { Socket } from 'socket.io';
import { PrismaGameService } from 'src/prisma/game/prisma.game.service';
import { GameService } from './game.service';
import { OnModuleInit } from '@nestjs/common';
import { GameParams } from '@prisma/client';

@Injectable()
export class RoomsService  implements OnModuleInit{
	constructor(private prismaService: PrismaGameService, private gameService: GameService){}

	async onModuleInit() {
		await this.prismaService.gameParams.findMany({})
		.then((gameParams) => {
			this.gameParams = gameParams;
		})
	}

	private rooms: Room[] = [];
	private roomMaxId:number = 1;
	private gameParams: GameParams[];
	private waitingRoomBasic: Player | null = null;
	private waitingRoomAdvanced: Player | null = null;

	async createEmptyRoom(typeGame:TypeGame) :Promise<Room | null> {
		const gameParam = this.gameParams.find((gp) => {return (gp.type === typeGame)});
		if (typeof(gameParam) === 'undefined') return null;
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
		this.rooms.push(newRoom);
		this.roomMaxId++;
		return (await this.updateRoomForAdvancedGame(newRoom));
	};

	async createRoom(playerLeft:Player, playerRight:Player, typeGame:TypeGame) {
		return(await this.createEmptyRoom(typeGame).then(
			(room) => {
				if (!room) return ; 
				room.gameStatus = 'WAITING_TO_START';
				room.playerLeft = playerLeft;
				room.playerRight = playerRight;
				return (room);
			})
		)
	};

	async updateRoomForAdvancedGame(room:Room) : Promise<Room> {
		return (
			await this.prismaService.gameMaps.findMany({
				include : {
					obstacles:true
				}
			}).then((maps) =>{ 
				const map = maps[Math.floor(Math.random() * maps.length)];
				room.obstacles = map.obstacles;
				for (let i = 0; i < map.nbBalls; i++) {
					room = this.gameService.addNewBall(room);
				}
				console.log('Room :', room.id, ' has been updated with maps');
				return (room);
			})
		);
	}

	joinWaitingRoom(player:Player, typeGame:TypeGame) {
		const waitingPlayer = (typeGame === 'ADVANCED' ? this.waitingRoomAdvanced : this.waitingRoomBasic);
		if (waitingPlayer === null) {
			if (typeGame === 'ADVANCED') this.waitingRoomAdvanced = player;
			else this.waitingRoomBasic = player;
			player.socket.emit('waiting_room_joined');
		}
		else {
			this.createRoom(player, waitingPlayer, typeGame);
			if (typeGame === 'ADVANCED') this.waitingRoomAdvanced = null;
			else this.waitingRoomBasic = null;
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

	findRoomOfPlayer(player: Player | null): Room | null {
		if (!player) return null;
		const room = this.rooms.find((element) => (element.playerLeft === player || element.playerRight === player));
		if (typeof(room) === 'undefined') {
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
		const room = this.rooms.find((element) => (element.id === idToFind));
		if (typeof(room) === 'undefined') {
			return null;
		}
		return room;
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
				ballInitSpeed: room.gameParam.BallInitSpeed,
				ballInitDir: {x:room.gameParam.BallInitDirx, y: room.gameParam.BallInitDiry },
				ballSpeedIncrease: room.gameParam.ballSpeedIncrease
			},
			playerLeft:{
				name:room.playerLeft?.name,
				socketId: room.playerLeft?.socket.id,
			},
			playerRight:{
				name:room.playerRight?.name,
				socketId: room.playerRight?.socket.id,
			},
			gameStatus:room.gameStatus
		};
		room.playerLeft?.socket.emit('room_status', data_to_send);
		room.playerRight?.socket.emit('room_status', data_to_send);
	}

	async addPlayerToRoom(player:Player, roomId:number) {
		let room = this.findRoomById(roomId);
		if (room === null) return;  
		if (room.playerLeft === player || room.playerRight === player) {
			player.socket.emit('Error_player_already_in_room');
			return;
		}
		if (room.playerLeft != null  && room.playerRight != null) {
			player.socket.emit('Error_room_full');
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
	
		this.sendRoomStatus(room);
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

	async removePlayerFromRoom(player:Player) {
		let room = this.findRoomOfPlayer(player);
		if (room === null) return ;
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

	handlePlayerKeyEvent(data:{key:string, idPlayerMove:number, client:Socket}){
		const room = this.findRoomOfPlayerBySocket(data.client)
		if (room) {
			this.gameService.movePlayerOnEvent({room, key:data.key, idPlayerMove:data.idPlayerMove, client:data.client});
		}
	}

}
