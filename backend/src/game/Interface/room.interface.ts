import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export type GameStatus = 'WAITING_FOR_PLAYER' | 'WAITING_TO_START' | 'STARTING' | 'PLAYING' | 'FINISHED';

export interface Room {
	id:string;
	ball:Ball;
	playerLeft:Player | null;
	playerRight:Player | null;
	scoreLeft:number;
	scoreRight:number;
	gameStatus:GameStatus;
	createdOn: Date;
	finishOn: Date | null;
	startingCountDownStart: Date | null;
	startingCount: number;
  }