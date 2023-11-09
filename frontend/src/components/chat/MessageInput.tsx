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
const MessageInput = (props: {chatId: number}) => {

	const [messages, setMessages] = useState<MessagePayload[]>([]);

	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);
	const {username} = useContext(ConnectionContext);

	const onSubmit = () => {
		if (value === "" || props.chatId < 0)
			return;
		const messageData = {
			username: username,
			content: value,
			idOfChat: props.chatId,
		}
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
				placeholder='Write...'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown} // gestion du bouton Enter pour envoyer
			/>
			<button onClick={onSubmit}>Send</button>
        </div>
    )
}

export default MessageInput;
