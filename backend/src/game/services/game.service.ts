import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Room } from '../interfaces/room.interface';

@Injectable()
export class GameService {
	private rooms : Room[];

	fetchActiveGameRoom():Room[] {
		return this.rooms;
	}

}
