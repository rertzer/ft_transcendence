import React, { useState, useContext, useEffect } from 'react';
import "./MessageInput.scss"
import { WebsocketContext } from '../../context/chatContext';
import { allChatOfUser } from './ChatComponent';


type ChatHistory = {
	msg: string;
	username: string;
	date: string;
	id: number;
}
const MessageInput = (props: {chatId: number}) => {

	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);
	const {username} = useContext(ConnectionContext);

	const onSubmit = () => {
		if (value === "" || props.chatId < 0)
			return;
		const messageData = {
			username: username,
			serviceMessage: false,
			content: value,
			idOfChat: props.chatId,
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
