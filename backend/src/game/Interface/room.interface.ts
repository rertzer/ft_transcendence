import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export type GameStatus = 'WAITING' | 'ONGOING' | 'FINISHED';

export interface Room {
	id:string;
	ball:Ball;
	playerLeft:Player | null;
	playerRight:Player | null;
	posYLeft:number;
	posYRight:number;
	scoreLeft:number;
	scoreRight:number;
	gameStatus:GameStatus;
  }