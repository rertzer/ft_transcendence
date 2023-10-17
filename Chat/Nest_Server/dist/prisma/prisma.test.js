"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.checkChatId = void 0;
const client_1 = require("@prisma/client");
const prismaService = new client_1.PrismaClient();
async function checkChatId(idSearched) {
    const chat = await prismaService.chatChannels.findFirst({
        where: {
            id: idSearched,
        },
    });
    if (chat) {
        return true;
    }
    else {
        return false;
    }
}
exports.checkChatId = checkChatId;
async function createUser() {
    try {
        const existingUser = await prismaService.user.findFirst({
            where: {
                email: 'johndoe@example.com',
            },
        });
        if (existingUser) {
            console.log('User already exists:', existingUser);
        }
        else {
            const newUser = await prismaService.user.create({
                data: {
                    username: 'your_username',
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'johndoe@example.com',
                    avatar: 'avatar_url',
                    role: 'user',
                    password: 'your_password',
                    game_won: 0,
                    game_lost: 0,
                    game_played: 0,
                },
            });
            const newUser2 = await prismaService.user.create({
                data: {
                    username: 'Pierrick',
                    first_name: 'jay',
                    last_name: ';avf',
                    email: 'johndoeff@example.com',
                    avatar: 'fffvvf',
                    role: 'user',
                    password: 'your_password',
                    game_won: 0,
                    game_lost: 0,
                    game_played: 0,
                },
            });
            console.log('User created:', newUser2);
        }
    }
    catch (error) {
        console.error('Error creating user:', error);
    }
    finally {
        await prismaService.$disconnect();
    }
    try {
        const existingChat = await prismaService.chatChannels.findFirst({
            where: {
                id: 1
            },
        });
        if (existingChat) {
            console.log('chat already exists:', existingChat);
        }
        else {
            const newChat1 = await prismaService.chatChannels.create({
                data: {
                    type: 'public',
                    password: null,
                    channelOwner: {
                        connect: { id: 1 }
                    }
                }
            });
        }
    }
    catch (error) {
        console.error('Error creating chat:', error);
    }
    finally {
        await prismaService.$disconnect();
    }
}
exports.createUser = createUser;
//# sourceMappingURL=prisma.test.js.map