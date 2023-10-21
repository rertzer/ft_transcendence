import { WebsocketContext } from "../contexts/ChatContext";
import { useContext, useEffect, useState } from 'react';
import ChatContext from "../contexts/ChatContext";

type CreateaChatPayload = {
	username: string;
	chatName: string;
	chatPassword: string;
	chatType: string;
}

export const CreateChat = () => {
	const {username} = useContext(ChatContext);
	const [chatName, setChatName] = useState('');
	const [error, setError] = useState('');
	const [password, setPassword] = useState('');
	const socket = useContext(WebsocketContext);
	const [encryptedMdp, setEncrptedMdp] = useState('');
	const [chatType, setChatType] = useState('public');

	// const encryptData = () => {
	// 	const data = CryptoJS.AES.encrypt(
	// 	  JSON.stringify(password),
	// 	  secretPass
	// 	).toString();

	// 	//setEncrptedData(data);
	//   };
	const onSubmit = () => {
		const createChatData: CreateaChatPayload = {
			username: username,
			chatName: chatName,
			chatType: chatType,
			chatPassword: password,
		}
		console.log("object send :", createChatData);
		socket.emit('createChat', createChatData);
		setChatName('');
		setPassword('');
	}

	return (
		<div>
			<h1>Create a Chat</h1>
			<div>
				<input
					type="text"
					placeholder="Chat Name"
					value={chatName}
					onChange={(e) => setChatName(e.target.value)}
				/>
				<p>
					Enter a password to protect your chat (not mandatory)
				</p>
				<input
					type="text"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<p>
					Select the type of chat
				</p>
				<select
					value={chatType}
					onChange={(e) => setChatType(e.target.value)}
				>
					<option value="public">Public</option>
					<option value="private">Private</option>
				</select>
				<button onClick={onSubmit}>Create</button>
				</div>
		</div>
	)
}
