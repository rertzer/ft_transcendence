import * as bcrypt from 'bcrypt';
import { getPasswordOfChat } from '../../prisma/chat/prisma.chat.service';


export async function encodePassword(rawPassword: string) {
	const SALT = bcrypt.genSaltSync();
	return bcrypt.hashSync(rawPassword, 10);
}

export function checkPassword(password: string, idOfChat: number): string {

	const passwordHashed = encodePassword(password);
	const passwordSaved = getPasswordOfChat(idOfChat);
	if (passwordHashed === passwordSaved) {
		return 'true';
	} else {
		return 'false';
	}
}

