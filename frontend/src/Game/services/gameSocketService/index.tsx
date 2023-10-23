import { io, Socket } from "socket.io-client";
/*import { DefaultEventsMap } from '@socket.io/component-emitter';

class GameSocketService {
	public socket: Socket =  io('http://localhost:4000');

	public connect(url:string): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
		return new Promise((resolve, reject) => {
			this.socket = io(url);
			if (!this.socket) {
				return reject();
			}
			this.socket.on("connect", () => {
				resolve(this.socket as Socket);
			});
			this.socket.on("connect_error", (error) => {
				console.log("Connextion error: ", error);
				reject(error);
			});
		}); 		
	}
};

const MySocketService = new GameSocketService()
export default MySocketService;*/

export const gameSocket:Socket = io('http://localhost:4000');
