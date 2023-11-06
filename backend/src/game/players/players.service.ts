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
	//A deplacer dans room pour avoir les parametres.
	/*processPlayerKeyEvent(param:{socket: Socket, key:string, idPlayerMove:number}) {
		let player = this.findOne(param.socket);
		if (!player) return; 
		switch (param.key){
			case 'KeyW':
				player.posY = Math.max(pong.paddleHeight / 2, MyPlayer.posY - pong.paddleSpeed);
				break;
			case 'KeyS':
				player.posY = param.move;
				break;
			case 'Space':
				player.readyToPlay = true;
				break;
			default:
				return; 
		}
	}*/


}
