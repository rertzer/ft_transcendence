import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PlayersService } from "../players/players.service";
import { Inject } from "@nestjs/common";
import { RoomsService } from "../rooms/rooms.service";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameSocketEvents {

	@Inject(PlayersService)
	private readonly playersService: PlayersService;

	@Inject(RoomsService)
	private readonly roomsService: RoomsService;

    @WebSocketServer()
    server: Server;

    //Connexion 
    handleConnection(client:Socket){
        console.log(`Client connected: ${client.id}`);
		this.playersService.create({
			upArrowDown:false,
			downArrowDown:false,
			name:'',
			socket: client});
		client.on('disconnect', () => {
			console.log(`Client disconnected ${client.id}`);
			const player = this.playersService.findOne(client);
			if (player) this.roomsService.removePlayerFromRoom(player);
			this.playersService.remove(client);
		})
    }

    //Recevoir un event 
    @SubscribeMessage('join_game')
    handleEvent(@MessageBody() data:{roomName:string, playerName:string}, @ConnectedSocket() client:Socket){
		const player = this.playersService.findOne(client);
		if (player) {
			this.playersService.changePlayerName(player, data.playerName);
			this.roomsService.addPlayerToRoom(player, data.roomName);
		} 
    }
}