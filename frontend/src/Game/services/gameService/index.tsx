import { Socket } from 'socket.io-client';
import gameContext from '../../gameContext';
import { useContext } from 'react';

class GameService {

	private opponentName:string = '';
	private playerSide:string = '';

	public async joinGameRomm(socket:Socket, roomId:string, playerName:string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			socket.emit("join_game", {roomId, playerName});
			socket.on("room_joined", (data) => {
				console.log("Room joined !");
				this.opponentName = data.opponentName;
				this.playerSide = data.playerSide;
				console.log('opponentName',data.opponentName);
				console.log('playerSide',data.playerSide)
				resolve(true);
			});
			socket.on('room_joined_error', (error) => {reject(error)});
		});
	}

	public getOpponentName():string {
		return (this.opponentName);
	};

	public getPlayerSide():string {
		return (this.playerSide);
	};

}; 

export default new GameService();