import { PrismaClient } from '@prisma/client'

export const prismaService = new PrismaClient()

export async function createUser() {
	try {
		// Check if a user with the same email exists
    const existingUser = await prismaService.user.findFirst({
		where: {
        email: 'johndoe@example.com', // Replace with the email you want to check
	},
    });
    if (existingUser) {
		console.log('User already exists');
    } else {
		// User doesn't exist, create a new user
		const newUser = await prismaService.user.create({
			data: {
				username: 'your_username',
				first_name: 'John',
				login: 'your_login',
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
				login: 'pjay',
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
}

