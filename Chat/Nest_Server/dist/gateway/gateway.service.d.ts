import { OnModuleInit } from "@nestjs/common";
import { Server } from 'socket.io';
export declare class MyGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    onNewMessage(messageData: {
        username: string;
        content: string;
    }): void;
    onJoinChatRoom(messageData: string): Promise<void>;
}
