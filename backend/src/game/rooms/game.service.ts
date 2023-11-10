import { Injectable } from "@nestjs/common";
import { PrismaGameService } from "src/prisma/game/prisma.game.service";
import { Room } from "../Interface/room.interface";
import { IGameParamBackEnd } from "../Interface/gameparam.interface";
import { Ball } from "../Interface/ball.interface";
import { Socket } from "socket.io";
import { Player } from "../Interface/player.interface";
import { GameParams } from "@prisma/client";

@Injectable()
export class GameService {

	constructor(private prismaService: PrismaGameService){}

	colision(playerPosY: number, ball:Ball, pong:GameParams, sidePlayer:string):boolean {
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

	moveBalls(room:Room) : Room {
		room.balls = room.balls.map((ball) => {
			if(room.gameStatus !== 'PLAYING') return (ball);
			ball.pos.x += (ball.speed / Math.sqrt(ball.dir.x**2 + ball.dir.y**2)) * ball.dir.x;
			ball.pos.y += (ball.speed / Math.sqrt(ball.dir.x**2 + ball.dir.y**2)) * ball.dir.y;
	
			/*Top or bottom collision*/
			if (ball.pos.y > 1 - room.gameParam.ballRadius 
				|| ball.pos.y < room.gameParam.ballRadius) {
					ball.dir.y = - ball.dir.y;
			}
			/* Paddle colision*/
			let playerWithBallPosY = (ball.pos.x <= 1 / 2) ? room.playerLeft?.posY! : room.playerRight?.posY!;
			let sidePlayer:string = (ball.pos.x <= 1 / 2) ? 'left' : 'right';
			let direction = (ball.pos.x <= 1 / 2) ? 1 : -1;
			if (this.colision(playerWithBallPosY, ball, room.gameParam, sidePlayer)) {
				let colisionY = (ball.pos.y - (playerWithBallPosY)) / (room.gameParam.paddleHeight / 2);
				let ang = colisionY * (Math.PI / 4);
				ball.dir.x = direction * Math.cos(ang);
				ball.dir.y = Math.sin(ang);
				ball.speed += room.gameParam.ballSpeedIncrease;
			}
			return (ball);
		});
		return (room);		
	}

	movePlayerOnEvent(param :{room: Room, key:string, idPlayerMove:number, client:Socket}) {
		let player:Player | null;
		param.room.playerLeft?.socket === param.client ? player = param.room.playerLeft : player = param.room.playerRight;
		if (!player) return ;
		player.idPlayerMove = param.idPlayerMove;
		switch (param.key){
			case 'KeyW':
				player.posY = Math.max(param.room.gameParam.paddleHeight / 2, player.posY - param.room.gameParam.paddleSpeed);
				break;
			case 'KeyS':
				player.posY = Math.min(1 - param.room.gameParam.paddleHeight / 2,  player.posY + param.room.gameParam.paddleSpeed);
				break;
			case 'Space':
				player.readyToPlay = true;
				break;
			default:
				return; 
		}
	}

	updateRoomGameStatus(room:Room) : Room {
		if (room.gameStatus === 'FINISHED' || !room.playerLeft || !room.playerRight ) return (room);
		if (room.gameStatus === 'WAITING_FOR_PLAYER' && room.playerLeft && room.playerRight ) {
			room.gameStatus = 'WAITING_TO_START';
		}
		else if (room.gameStatus === 'WAITING_TO_START' && room.playerLeft.readyToPlay && room.playerRight.readyToPlay) {
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
		return (room);
	}

	addNewBall(room: Room) : Room {
		const newId:number = room.balls.length;
		room.balls.push({
			id: newId, 
			pos: {x:room.gameParam.ballInitPosx,  y:room.gameParam.ballInitPosy},
			dir: {
				x: Math.random() > 0.5 ? (Math.random() * 0.8) + 0.2 : -((Math.random() * 0.8) + 0.2 ), 
				y: (Math.random() * 2) - 1
			},
			speed: room.gameParam.BallInitSpeed
		});
		return (room);
	}

	checkballsPositions(room: Room) : Room {
		let ballsOut = room.balls.filter((ball) => {return ((ball.pos.x > 1 || ball.pos.x < 0))});
		if (ballsOut.length === 0) return (room);
		room.balls = room.balls.filter((ball) => {return (!(ball.pos.x > 1 || ball.pos.x < 0))});
		ballsOut.forEach((ball) => {
			let sidePlayer:string = (ball.pos.x <= 1 / 2) ? 'left' : 'right';
			sidePlayer === 'left' ? room.scoreRight++ : room.scoreLeft++;
		});
		if (room.scoreRight >= room.gameParam.goal || room.scoreLeft >= room.gameParam.goal) {
			room.gameStatus = 'FINISHED';
			this.prismaService.finishGame(room, null);
		}
		for (let i = 0; i < ballsOut.length; i++) {
			room = this.addNewBall(room);
		}
		return (room);
	}

	playGameLoop(rooms : Room[]) : Room[] {
		const newRooms: Room[] = rooms.map((room) => {
			room = this.updateRoomGameStatus(room);
			room = this.moveBalls(room);
			room = this.checkballsPositions(room);
			return (room);
		});
		return (newRooms);
	}
}