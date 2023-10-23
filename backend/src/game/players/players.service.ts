import { Injectable } from '@nestjs/common';
import { Player } from '../Interface/player.interface';
import { Socket } from 'socket.io';

@Injectable()
export class PlayersService {
	private players: Player[] = [];

	create(player: Player) {
		this.players.push(player);
	}
	findAll(): Player[] {
		return this.players;
	}
	findOne(socket: Socket): Player | undefined {
		return this.players.find((element) => element.socket === socket);
	}
}
