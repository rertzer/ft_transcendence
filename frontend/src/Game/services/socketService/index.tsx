import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';

class SocketService {
	public socket: Socket | null = null;

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

const MySocketService = new SocketService()
export default MySocketService;