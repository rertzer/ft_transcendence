import { Injectable } from '@nestjs/common';
import { Player } from '../Interface/player.interface';
import { Socket } from 'socket.io';

@Injectable()
export class PlayersService {
	private players: Player[] = [];

	create(player: Player) {
		this.players.push(player);
		console.log('Create Player');
		console.log('Players:',this.players);
	};

	remove(clientSocket: Socket) {
		this.players = this.players.filter((p) => {return p.socket != clientSocket;});
		console.log('Remove Player');
		console.log('Players:',this.players);
	};

	findAll(): Player[] {
		return this.players;
	};

	findOne(socket: Socket): Player | null {
		const player = this.players.find((element) => element.socket === socket);
		if (typeof(player) === 'undefined') {
			return null;
		}
		return player
	};

	changePlayerName(player:Player, newName:string) {
		const index = this.players.indexOf(player);
		if (index != -1) {
			player.name = newName;
			this.players[index] = player;
		}
		console.log('Players:',this.players);
	};

	processPlayerKeyEvent(param:{socket: Socket, key:string, move:boolean}) {
		let player = this.findOne(param.socket);
		if (!player) return; 
		switch (param.key){
			case 'KeyW':
				player.upArrowDown = param.move;
				break;
			case 'KeyS':
				player.downArrowDown = param.move;
				break;
			case 'ArrowUp':
				player.upArrowDown = param.move;
				break;
			case 'ArrowDown':
				player.downArrowDown = param.move;
				break;
			case 'Space':
				player.readyToPlay = true;
				break;
			default:
				return; 
		}
	}


}
