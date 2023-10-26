import { BallDto } from "./ball.dto";
import { PlayerDto } from "./player.dto";

export type GameStatus = 'WAITING' | 'ONGOING' | 'FINISHED';

export class RoomDto {
	ball:BallDto;
	playerLeft:PlayerDto;
	playerRight:PlayerDto;
	gameStatus:GameStatus;
  }