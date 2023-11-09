import { GameObstacles } from "@prisma/client";
import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export type GameStatus = 'WAITING_FOR_PLAYER' | 'WAITING_TO_START' | 'STARTING' | 'PLAYING' | 'FINISHED' | 'FINISH_BY_FORFAIT';

export type TypeGame = 'BASIC' | 'ADVANCED';

export interface Room {
	id:number;
	balls:Ball[];
	obstacles:GameObstacles[];
	ballHasLeft:boolean;
	playerLeft:Player | null;
	playerRight:Player | null;
	scoreLeft:number;
	scoreRight:number;
	gameStatus:GameStatus;
	createdOn: Date;
	finishOn: Date | null;
	startingCountDownStart: Date | null;
	startingCount: number;
	bddGameId:number;
	typeGame:TypeGame;
  }