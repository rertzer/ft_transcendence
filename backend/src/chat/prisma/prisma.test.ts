import { PrismaClient } from '@prisma/client'

const prismaService = new PrismaClient()

export async function checkChatId(idSearched: number) {
	const chat = await prismaService.chatChannels.findFirst({
		where: {
			id: idSearched,
		},
	})
	if (chat) {
		return true;
	}
	else{
		return false;
	}
}

export async function createUser() {
	try {
		// Check if a user with the same email exists
    const existingUser = await prismaService.user.findFirst({
		where: {
        email: 'johndoe@example.com', // Replace with the email you want to check
	},
    });
    if (existingUser) {

		console.log('User already exists:', existingUser);
    } else {
		// User doesn't exist, create a new user
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
          // Add other user fields as needed
        },
	});
	console.log('User created:', newUser2);
	}
	} catch (error) {
		console.error('Error creating user:', error);
	} finally {
		await prismaService.$disconnect(); // Disconnect from the database when done
	}
	try {
		// Check if a user with the same email exists
		const existingChat = await prismaService.chatChannels.findFirst({
			where: {
			id: 1 // Replace with the email you want to check
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
		})
		}

	} catch (error) {
		console.error('Error creating chat:', error);
	}
	finally {
		await prismaService.$disconnect(); // Disconnect from the database when done
	}
}

