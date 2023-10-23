import React, { useState, useContext, useEffect } from 'react';
import "./MessageInput.scss"
import ChatContext, { WebsocketContext } from '../../Chat/contexts/ChatContext';
import  ConnectionContext from "../../context/authContext"

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
const MessageInput = () => {

	const [messages, setMessages] = useState<MessagePayload[]>([]);

	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);
	const { setIsInChat, chatId} = useContext(ChatContext);
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
		if (value === "")
			return;
		const messageData = {
			username: username,
			content: value,
			idOfChat: 1,
		}
		console.log(" username send ", username)
		socket.emit('newMessage', messageData);
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
			<button onClick={onSubmit}>envoi</button>
        </div>
    )
}

export default MessageInput;
