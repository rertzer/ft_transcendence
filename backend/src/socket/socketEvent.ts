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
    @SubscribeMessage('message')
    handleEvent(@MessageBody() data:string, @ConnectedSocket() client:Socket){
        // envoyer un event
        this.server.emit('message', client.id, data);
    }
}