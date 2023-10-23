import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PlayersService } from "../players/players.service";
import { Inject } from "@nestjs/common";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameSocketEvents {

	@Inject(PlayersService)
	private readonly playerService: PlayersService;

    @WebSocketServer()
    server: Server;

    //Connexion 
    handleConnection(client:Socket){
        console.log(`Client connected: ${client.id}`);
		this.playerService.create({upArrowDown:false,
			downArrowDown:false,
			name:'toto',
			socket: client})
		client.on('disconnect', () => {
			console.log(`Client disconnected ${client.id}`);
		})
    }

    //Recevoir un event 
    @SubscribeMessage('join_game')
    handleEvent(@MessageBody() data:{roomId:string, playerName:string}, @ConnectedSocket() client:Socket){
		console.log(`${client.id} asked to join ${data.roomId} with player Name ${data.playerName}`);
		client.emit('room_joined', {opponentName: 'Toto', playerSide:'left'});
    }
}