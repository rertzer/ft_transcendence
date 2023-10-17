"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_test_1 = require("../prisma/prisma.test");
let lastMessageId = 0;
(0, prisma_test_1.createUser)();
let MyGateway = class MyGateway {
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('connected');
        });
    }
    onNewMessage(messageData) {
        console.log(messageData);
        console.log('gateway side');
        lastMessageId++;
        this.server.emit('onMessage', {
            msg: 'New message',
            content: messageData.content,
            username: messageData.username,
            id: lastMessageId
        });
    }
    async onJoinChatRoom(messageData) {
        console.log("message receive : ", messageData);
        console.log('gateway side');
        const chatExist = await (0, prisma_test_1.checkChatId)(parseInt(messageData));
        if (chatExist === false) {
            console.log("Chat asked have not been found");
            this.server.emit('onJoinChatRoom', {
                id: '-1'
            });
            return;
        }
        console.log("Chat asked have been found");
        this.server.emit('onJoinChatRoom', {
            msg: 'New message',
            id: messageData
        });
    }
};
exports.MyGateway = MyGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MyGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('newMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyGateway.prototype, "onNewMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('JoinChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MyGateway.prototype, "onJoinChatRoom", null);
exports.MyGateway = MyGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
        }
    })
], MyGateway);
//# sourceMappingURL=gateway.service.js.map