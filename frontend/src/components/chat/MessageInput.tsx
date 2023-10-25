import React, { useState, useContext, useEffect } from 'react';
import "./MessageInput.scss"
import { WebsocketContext } from '../../context/chatContext';
import  ConnectionContext from "../../context/authContext"
import { allChatOfUser } from './ChatComponent';

type MessagePayload = {
	msg: string;
	username: string;
	id: string;
  };

type ChatHistory = {
	msg: string;
	username: string;
	date: string;
	id: number;
}
const MessageInput = (props: {chatId: string}) => {

	const [messages, setMessages] = useState<MessagePayload[]>([]);

	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);
	const {username} = useContext(ConnectionContext);

	useEffect(() => {

		socket.on('onMessage', (newMessage: MessagePayload) => {
			console.log('onMessage event received!');
			console.log(newMessage);
			setMessages((prev) => [...prev, newMessage]);
			});

		return () => {
			console.log('Unregistering Events...');
			socket.off('onMessage');
			socket.off('retrieveMessage');
		};
	}, []);

	const onSubmit = () => {
		if (value === "" || parseInt(props.chatId) < 0)
			return;
		const messageData = {
			username: username,
			content: value,
			idOfChat: parseInt(props.chatId),
		}
		console.log(" username send ", username)
		socket.emit('newMessage', messageData);
		socket.emit('chatList', username); // super bizarre, des fois ca marche et des fois un temps de retard
		setValue('');
	  };

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.key === "Enter") {
			onSubmit();
		}
	}

    return (
        <div className='messageinput'>
            <input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown} // gestion du bouton Enter pour envoyer
			/>
			<button onClick={onSubmit}>Send</button>
        </div>
    )
}

export default MessageInput;
