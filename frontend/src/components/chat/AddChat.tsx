import React, { useState, useContext, useEffect } from 'react';
import "./MessageInput.scss"
import ChatContext, { WebsocketContext } from '../../Chat/contexts/ChatContext';
import  ConnectionContext from "../../context/authContext"
import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from  "@mui/material";
import "./AddChat.scss";

type CreateaChatPayload = {
	username: string;
	chatName: string;
	chatPassword: string;
	chatType: string;
}

export const AddChat = () => {
	const {username} = useContext(ConnectionContext);
	const [chatName, setChatName] = useState('');
	const [password, setPassword] = useState('');
	const socket = useContext(WebsocketContext);
	const [chatType, setChatType] = useState('public');
	const [showForm, setShowForm] = useState(false);
	const [chatInfo, setChatInfo] = useState({}); // Define the state for chat information

	const toggleForm = () => {
	  setShowForm(!showForm);
	};

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
		<div className='addchat'>
			<Tooltip title="Create new channel" arrow>
				<AddIcon onClick={toggleForm} style={{cursor: "pointer"}}/>
			</Tooltip>
			<div className={showForm? 'submenu' : 'submenu-hidden'}>
			{showForm && (
				<div>
				<input
					type="text"
					placeholder="Chat Name"
					value={chatName}
					onChange={(e) => setChatName(e.target.value)}
				/>
				<p>Enter a password to protect your chat (not mandatory)</p>
				<p>Select the type of chat</p>
				<select
					value={chatType}
					onChange={(e) => setChatType(e.target.value)}
				>
					<option value="public">Public</option>
					<option value="private">Private</option>
					<option value="protected by password">Protected by password</option>
				</select>
				{chatType === 'protected by password' && (
					<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					/>
				)}
				<button onClick={onSubmit}>Create</button>
				</div>
			)}
			</div>
		</div>
	  );
}
