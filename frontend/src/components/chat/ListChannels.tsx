import MenuIcon from '@mui/icons-material/Menu';
import LockIcon from '@mui/icons-material/Lock';  // lock icon for channels protected by password
import { Tooltip } from '@mui/material';
import { allChatOfUser } from './ChatComponent';
import "./ListChannels.scss"
import { useContext, useState, useEffect } from 'react';
import { WebsocketContext } from '../../context/chatContext';
import  ConnectionContext from "../../context/authContext";
import ChatContext from '../../context/chatContext';
import { ChatTwoTone } from '@mui/icons-material';

type Channel = {
	id : number; 
	name: string;
	owner: string;
	type: string;
	password: null | string;
}

export const ListChannels = (props: {chatsOfUser: allChatOfUser[], showSubMenu: string, setShowSubMenu: Function}) => {

    const socket = useContext(WebsocketContext);
	// const [idChatRoom, setIdChatRoom] = useState<JoinChatRoomPayload[]>([]);
	const {username} = useContext(ConnectionContext);
	const {setChatId} = useContext(ChatContext);
	const [password, setPassword] = useState('');
	const [chanToJoin, setChanToJoin] = useState<Channel>({id: -1, name: "", owner: "", type: "", password: null});
	const [availableChannels, setAvailableChannels] = useState<Channel[]>([{id: -1, name: "", owner: "", type: "", password: null}]);
	const [errorMessage, setErrorMessage] = useState("");

	const DealWithIdChat = async () => {
		const returnValue = await SendIdChat();
		console.log("RETVAL : ", returnValue);
		if (returnValue === -3) {
			setErrorMessage("Oops, something wrong happened")
			setChanToJoin({id: -1, name: "", owner: "", type: "", password: null})
		} else if (returnValue === -2) {
			setErrorMessage("You cannot join this chat because you were banned");
			setChanToJoin({id: -1, name: "", owner: "", type: "", password: null})
		} else if (returnValue === -1) {
			setErrorMessage("Wrong password");
			setChanToJoin({id: -1, name: "", owner: "", type: "", password: null})
		} else {
			setErrorMessage("");
		}
	  }

	  const SendIdChat = async () => {
		let messageData;
		if (chanToJoin.type = "protected by password") {
			messageData = {
				username: username,
				chat_id: chanToJoin.id,
				password: password,
		  };
		}
		else {
			messageData = {
				username: username,
				chat_id: chanToJoin.id,
				password: null,
			  };
		}
		const requestOptions = {
		  method: 'post',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(messageData),
		};
		try {
		  const response = await fetch('http://localhost:4000/chatOption/joinChat/', requestOptions);

		  if (!response.ok) {
			throw new Error('Request failed');
		  }

		  const data = await response.json();
		  console.log('Success:', data);
		  setPassword('');
		  socket.emit('chatListOfUser', username);
		  return data; 
		} catch (error) {
		  console.error('Error:', error);
		  return -3;
		}
	  }

	useEffect(() => {

		setErrorMessage("");
		setChanToJoin({id: -1, name: "", owner: "", type: "", password: null});
		if (props.showSubMenu !== "list")
			return;
		socket.emit('chatList');
		socket.on("chatList", (available: Channel[]) => {
			setAvailableChannels(available);
		});

		return () => {
			socket.off("chatList");
		}
	}, [props.showSubMenu]);

    const toggleForm = () => {
		console.log("AVAILABLE",availableChannels)
        if (props.showSubMenu !== "list") {
            props.setShowSubMenu("list");
      } else {
          props.setShowSubMenu("none");
      }
    }

	function isNotAlreadyIn(chan: Channel) {
		if (props.chatsOfUser.find((element) => element.id === chan.id)) {
			return (false);
		}
		return (true);
	}

    return (
    <div className='listchannels'>
        <Tooltip title="List available channels" arrow>
            <MenuIcon onClick={toggleForm}/>
        </Tooltip>
		{props.showSubMenu === "list" ? 
        <div className="submenu">
			<div className="top">
				<div className="joinInfo">
				{chanToJoin.id === -1 ? <span>Choose a channel to join</span> : <span>Do you want to join "{chanToJoin.name}" ?</span>}
				{chanToJoin.type === "protected by password" && <input
					type="password"
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					/>}
				</div>
				{ chanToJoin.id !== -1 && <button onClick={() => {DealWithIdChat(); setChanToJoin({id: -1, name: "", owner: "", type: "", password: null})}}>Join</button>}
			</div>
			<hr/>
			{errorMessage !== "" ?
			<div>
				<p>{errorMessage}</p>
				<hr/>
			</div> : <div></div>}
            {availableChannels.filter(isNotAlreadyIn).map((chan) => {return (
			<div className="channelItem" key={chan.id}>
				<p onClick={() => {setChanToJoin(chan)}}>{chan.name}</p>
				{chan.type === "protected by password" && <LockIcon />}
			</div>
			)
			})}
        </div> : <div></div>}
    </div>
    );
}
