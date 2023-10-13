import { Socket } from 'socket.io-client';

class GameService {

	public async joinGameRomm(socket:Socket, roomId:string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			socket.emit("join_game", {roomId});
			socket.on("room_joined", () => {
				console.log("Room joined !");
				resolve(true);
			});
			socket.on('room_joined_error', (error) => {reject(error)});
		});
	}

}; 

export default new GameService();