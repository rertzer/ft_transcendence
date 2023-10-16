import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketEvents {

    @WebSocketServer()
    server: Server;

    //Connexion 
    handleConnection(client:Socket){
        console.log(`Client connected: ${client.id}`);
    }
    //Deconnexion 
    handleDisConnect(client:Socket) {
        console.log(`Client disconnected ${client.id}`);
    }

    //Recevoir un event 
    @SubscribeMessage('join_game')
    handleEvent(@MessageBody() data:{roomId:string, playerName:string}, @ConnectedSocket() client:Socket){
		console.log(`${client.id} asked to join ${data.roomId} with player Name ${data.playerName}`);
		client.emit('room_joined', {opponentName: 'Toto', playerSide:'left'});
    }
}