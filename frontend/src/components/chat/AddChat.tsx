import { useState, useContext } from 'react';
import { WebsocketContext } from '../../context/chatContext';
import ChatContext from '../../context/chatContext';
import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from  "@mui/material";
import "./AddChat.scss";
import { useLogin } from "../../components/user/auth";

type CreateChatPayload = {
	login: string;
	chatName: string;
	chatPassword: string | null;
	chatType: string;
}

export const AddChat = (props: {showSubMenu: string, setShowSubMenu: Function}) => {
	const auth = useLogin();
	const {setNeedToUpdate} = useContext(ChatContext);
	const [chatName, setChatName] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const socket = useContext(WebsocketContext);
	const [chatType, setChatType] = useState('public');

	const toggleForm = () => {
		setErrorMessage('');
		if (props.showSubMenu !== "add") {
	  		props.setShowSubMenu("add");
		} else {
			props.setShowSubMenu("none");
		}
	};

	const onSubmit = () => {

		let createChatData: CreateChatPayload;
		if (chatName === "") {
			setErrorMessage("Channel Name cannot be left empty")
			return ;
		}
		else if (chatType === "protected by password" && password === "") {
			setErrorMessage("Password needs to be specified")
			return;
		}
		if (password === "")
		{
			createChatData = {
				login: auth.user.login,
				chatName: chatName,
				chatType: chatType,
				chatPassword: null,
			}
		}
		else
		{
			createChatData = {
				login: auth.user.login,
				chatName: chatName,
				chatType: chatType,
				chatPassword: password,
			}
		}
		socket.emit('createChat', createChatData);
		setNeedToUpdate("addChat");
		setChatName('');
		setPassword('');
		toggleForm();
	}
	return (
		<div className='addchat'>
			<Tooltip title="Create new channel" arrow>
				<AddIcon onClick={toggleForm}/>
			</Tooltip>
			<div className={props.showSubMenu === "add" ? 'submenu' : 'submenu-hidden'}>
				<div className='form'>
					<div>
						<input
							type="text"
							placeholder="Channel Name"
							maxLength={42}
							value={chatName}
							onChange={(e) => setChatName(e.target.value)}
						/>
						<p>Select the type of channel.</p>
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
							maxLength={16}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							/>
						)}
					</div>
					{errorMessage !== "" && <div className='error'>{errorMessage}</div>}
					<button onClick={onSubmit}>Create</button>
				</div>
			</div>
		</div>
	  );
}
