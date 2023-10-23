import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export type GameStatus = 'WAITING' | 'ONGOING' | 'FINISHED';

export interface Room {
	ball:Ball;
	playerLeft:Player;
	playerRight:Player;
	gameStatus:GameStatus;
  }