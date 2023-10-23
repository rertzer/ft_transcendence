import { Socket } from 'socket.io-client';
import gameContext from '../../gameContext';
import { useContext } from 'react';

class GameService {

	private opponentName:string = '';
	private playerSide:string = '';
	private id:string = '' ;

	public async joinGameRoom(socket:Socket, roomId:string, playerName:string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			socket.emit("join_game", {roomId, playerName});
			socket.on("room_joined", (data) => {
				console.log("Room joined !");
				console.log(data);
				resolve(true);
			});
			socket.on('room_joined_error', (error) => {reject(error)});
			socket.on('room_status_change', (data) => {
				console.log("room_status_change");
				console.log(data);				
				resolve(true);
			})
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