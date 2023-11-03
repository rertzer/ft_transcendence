import { Injectable } from '@nestjs/common';
import { Room } from '../Interface/room.interface';
import { Player } from '../Interface/player.interface';
import { Ball } from '../Interface/ball.interface';
import { IGameParamBackEnd } from '../Interface/gameparam.interface';
import { Socket } from 'socket.io';

function leftboard(ball:Ball):boolean {
    return (ball.pos.x > 1 || ball.pos.x < 0)
}

function colision(playerPosY: number, ball:Ball, pong:IGameParamBackEnd, sidePlayer:string):boolean {
    const ballTop:number = ball.pos.y - pong.ballRadius;
    const ballBtm:number = ball.pos.y + pong.ballRadius;
    const ballLeft:number = ball.pos.x - pong.ballRadius;
    const ballRight:number = ball.pos.x + pong.ballRadius;

    const paddleTop:number =  playerPosY - pong.paddleHeight/2;
    const paddleBtm:number = playerPosY + pong.paddleHeight/2;
	
    const paddleLeft:number = sidePlayer === 'left' ? 0 : 1 - pong.paddleWidth;
    const paddleRight:number = sidePlayer === 'left' ? pong.paddleWidth : 1;

    return (ballRight > paddleLeft && ballTop < paddleBtm && ballLeft < paddleRight && ballBtm > paddleTop)
}

@Injectable()
export class RoomsService {
	private rooms: Room[] = [];
	private initBall : Ball = {
		pos: {x:1/2, y:1/2},
		dir: {x: 0.5, y: -1},
		speed:0.006,
	};

	private gameParam : IGameParamBackEnd = {
		ballRadius: 0.01,
		paddleWidth: 0.02,
		paddleHeight: 0.25,
		ballSpeedIncrease: 0.0005,
		paddleSpeed:0.01,
		goal:3
	};

	createRoom(idRoom:string, player:Player) {
		const newRoom: Room = {
			id:idRoom,
			ball: {
				pos: {x:this.initBall.pos.x, y:this.initBall.pos.y},
				dir: {x: this.initBall.dir.x, y:  this.initBall.dir.y},
				speed: this.initBall.speed
			},
			playerLeft:player,
			playerRight:null,
			scoreLeft:0,
			scoreRight:0,
			gameStatus:'WAITING_FOR_PLAYER', 
			createdOn: new Date(),
			finishOn: null,
			startingCountDownStart: null,
			startingCount: 0
		}
		this.rooms.push(newRoom);
		console.log('Room created');
		console.log('Rooms :', this.rooms);
		return (newRoom);
	};

	removeRoom(room: Room) {
		this.rooms = this.rooms.filter((r) => {return r != room;});
		console.log('Remove room');
		console.log('Rooms :', this.rooms);
	};

	findAllRoom(): Room[] {
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

	findRoomById(idToFind:string) : Room | null {
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
				ballRadius: this.gameParam.ballRadius,
				paddleWidth:this.gameParam.paddleWidth,
				paddleHeight: this.gameParam.paddleHeight,
				paddleSpeed: this.gameParam.paddleSpeed,
				goal: this.gameParam.goal,
				ballInitSpeed: this.initBall.speed,
				ballInitDir: {x:this.initBall.dir.x, y:this.initBall.dir.y},
				ballSpeedIncrease: this.gameParam.ballSpeedIncrease
				
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

	addPlayerToRoom(player:Player, roomName:string) {
		let room = this.findRoomById(roomName);
		if (room === null) {
			room = this.createRoom(roomName, player)
			player.room = room;
		}
		else if (room.playerLeft === player || room.playerRight === player) {
			player.socket.emit('Error_player_already_in_room');
		}
		else if (room.playerLeft != null  && room.playerRight != null) {
			player.socket.emit('Error_room_full');
		}
		else {
			if (room.playerLeft === null) {
				room.playerLeft = player;
			}
			else {
				room.playerRight = player;
			}
			player.room = room;
			room.gameStatus = 'WAITING_TO_START';
			console.log('Player ', player.socket.id, ' added to Room ', room.id);
		}
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

	removePlayerFromRoom(player:Player) {
		let room = this.findRoomOfPlayer(player);
		if (room === null) return ;
		if (this.getNumberOfPlayersInRoom(room) != 2){
			this.removeRoom(room);
		}
		else if (room.playerLeft === player) {
			room.playerLeft = null;
		}
		else if (room.playerRight === player) {
			room.playerRight = null;
		}
			room.gameStatus = 'WAITING_FOR_PLAYER';
		this.sendRoomStatus(room);
	};

	moveBall(room:Room) {
		if(room.gameStatus !== 'PLAYING') return ;
		room.ball.pos.x += (room.ball.speed / Math.sqrt(room.ball.dir.x**2 + room.ball.dir.y**2)) * room.ball.dir.x;
    	room.ball.pos.y += (room.ball.speed / Math.sqrt(room.ball.dir.x**2 + room.ball.dir.y**2)) * room.ball.dir.y;

		/*Top or bottom collision*/
		if (room.ball.pos.y > 1 - this.gameParam.ballRadius 
			|| room.ball.pos.y < this.gameParam.ballRadius) {
				room.ball.dir.y = - room.ball.dir.y;
		}
		/* Paddle colision*/
		let playerWithBallPosY = (room.ball.pos.x <= 1 / 2) ? room.playerLeft?.posY! : room.playerRight?.posY!;
		let sidePlayer:string = (room.ball.pos.x <= 1 / 2) ? 'left' : 'right';
		let direction = (room.ball.pos.x <= 1 / 2) ? 1 : -1;
		if (colision(playerWithBallPosY, room.ball, this.gameParam, sidePlayer)) {
			let colisionY = (room.ball.pos.y - (playerWithBallPosY)) / (this.gameParam.paddleHeight / 2);
			let ang = colisionY * (Math.PI / 4);
			room.ball.dir.x = direction * Math.cos(ang);
			room.ball.dir.y = Math.sin(ang);
			room.ball.speed += this.gameParam.ballSpeedIncrease;
		}
		if (leftboard(room.ball)) {
			sidePlayer === 'left' ? room.scoreRight++ : room.scoreLeft++;
			if (room.scoreRight === this.gameParam.goal || room.scoreLeft === this.gameParam.goal) {
				room.gameStatus = 'FINISHED';
			}
			else {
				room.gameStatus = 'WAITING_TO_START';
			}
			if (room.playerLeft) room.playerLeft.readyToPlay = false;
			if (room.playerRight) room.playerRight.readyToPlay = false;
			room.ball = {
				pos: {x: this.initBall.pos.x, y: this.initBall.pos.y},
				dir: {x: -room.ball.dir.x, y: room.ball.dir.y},
				speed: this.initBall.speed
			}
			if (room.playerLeft) room.playerLeft.posY = 0.5;
			if (room.playerRight) room.playerRight.posY = 0.5;
		}
	}

	movePlayerOnEvent(param :{room: Room, key:string, idPlayerMove:number, client:Socket}) {
		let player:Player | null;
		param.room.playerLeft?.socket === param.client ? player = param.room.playerLeft : player = param.room.playerRight;
		if (!player) return ;
		player.idPlayerMove = param.idPlayerMove;
		switch (param.key){
			case 'KeyW':
				player.posY = Math.max(this.gameParam.paddleHeight / 2, player.posY - this.gameParam.paddleSpeed);
				break;
			case 'KeyS':
				player.posY = Math.min(1 - this.gameParam.paddleHeight / 2,  player.posY + this.gameParam.paddleSpeed);
				break;
			case 'Space':
				player.readyToPlay = true;
				break;
			default:
				return; 
		}
	}

	updateRoomGameStatus(room:Room) {
		if (room.gameStatus === 'WAITING_FOR_PLAYER' || room.gameStatus === 'FINISHED'
		|| !room.playerLeft || !room.playerRight ) return;
		if (room.gameStatus === 'WAITING_TO_START' && room.playerLeft.readyToPlay && room.playerRight.readyToPlay) {
			room.gameStatus = 'STARTING';
		}
		else if (room.gameStatus === 'STARTING' && room.startingCount >= 3) {
			room.gameStatus = 'PLAYING';
			room.startingCount = 0;
			room.startingCountDownStart = null;
		}
		else if (room.gameStatus === 'STARTING') {
			if (room.startingCountDownStart === null) {
				room.startingCountDownStart = new Date();
			}
			const newDate = new Date();
			room.startingCount = (newDate.getTime() - room.startingCountDownStart.getTime()) / 1000;
		}
	}

	playGameLoop() {
		this.rooms.forEach(room => {
			this.updateRoomGameStatus(room);
			//this.movePlayers(room);
			this.moveBall(room);
		});
	};

	broadcastGameState() {
		this.rooms.forEach(room => {
			const data = {
				ball:room.ball,
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

}
