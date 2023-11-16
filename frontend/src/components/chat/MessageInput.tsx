import React, { useState, useContext, useEffect } from 'react';
import "./MessageInput.scss"
import { WebsocketContext } from '../../context/chatContext';
import userContext from '../../context/userContext';
import  ConnectionContext from "../../context/authContext"


// type ChatHistory = {
// 	msg: string;
// 	username: string;
// 	date: string;
// 	id: number;
// }
const MessageInput = (props: {chatId: number}) => {

	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);
	const {user} = useContext(userContext);
	const onSubmit = () => {
		if (value === "" || props.chatId < 0)
			return;
		const messageData = {
			username: user.username,
			login: user.login,
			serviceMessage: false,
			content: value,
			idOfChat: props.chatId,
		}
		console.log(" login send ", user.login)
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
				maxLength={1024}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<button onClick={onSubmit}>Send</button>
        </div>
    )
}

export default MessageInput;
