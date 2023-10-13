import { PrismaClient, Prisma } from '@prisma/client'

const prismaService = new PrismaClient()

export async function addChatChannel() {
	try {
	  // Define the properties of the new chat channel
	  const newChatChannel = {
		owner: 1, // Set the owner's ID (adjust this value accordingly)
		type: 'public', // Set the type of the chat channel (e.g., 'public', 'private', etc.)
		password: null, // Set a password if applicable, or null if it's not a private channel
	  };

	  // Use Prisma to create a new chat channel in the database
	  const createdChatChannel = await prismaService.chatChannels.create({
		data: newChatChannel,
	  });

	  console.log('New chat channel created:', createdChatChannel);
	} catch (error) {
	  console.error('Error creating chat channel:', error);
	} finally {
	  await prismaService.$disconnect(); // Disconnect from the Prisma client
	}
  }

export  async function createUser() {
	try {
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
		  // Add other user fields as needed
		},
	  });

	  console.log('User created:', newUser);
	} catch (error) {
	  console.error('Error creating user:', error);
	} finally {
	  await prismaService.$disconnect(); // Disconnect from the database when done
	}
  }

