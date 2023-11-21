import React, { useState, useContext, useEffect } from 'react';
import "./MessageInput.scss"
import { WebsocketContext } from '../../context/chatContext';
import { useLogin } from "../../components/user/auth";
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
	const auth = useLogin();
	const onSubmit = () => {
		if (value === "" || props.chatId < 0)
			return;
		const messageData = {
			username: auth.user.username,
			login: auth.user.login,
			serviceMessage: false,
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
