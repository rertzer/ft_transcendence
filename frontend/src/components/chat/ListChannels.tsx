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
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const [chanToJoin, setChanToJoin] = useState<Channel>({id: 0, name: "", owner: "", type: "", password: null});
	const [availableChannels, setAvailableChannels] = useState<Channel[]>([{id: -1, name: "", owner: "", type: "", password: ""}]);
	const [errorMessage, setErrorMessage] = useState("");

	// useEffect(() => {
	// 	socket.on('onJoinChatRoom', (idChatRoom: JoinChatRoomPayload) => {
	// 		if (idChatRoom.id === '-1')
	// 		{

	// 			setId('Doesnt exist')
	// 		}
	// 		else{
	// 			// ici c'est faux si je te renvoie -2 c'est protege par du password
	// 			// -3 c'est prive
	// 			//sinon c'est good



	// 			setChatId(parseInt(idChatRoom.id));
	// 			setIdChatRoom((prev) => [...prev, idChatRoom]);
	// 		}
	// 	  });
	// 	  return () => {
	// 		socket.off('onJoinChatRoom');
	// 	};
	// }, []);

	const DealWithIdChat = async () => {
		const returnValue = await SendIdChat();
		if (returnValue === "-1") {
		 		// ici c'est faux si je te renvoie -2 c'est protege par du password
				// -3 c'est prive
				//sinon c'est good
				setId('Doesnt exist')
		} else {
		  // Handle other cases
			setChatId(parseInt(returnValue.id));

		}
	  }

	  const SendIdChat = async () => {
		if (id === "") {
		  return "-1"; // Return an empty string or another default value
		}
		const messageData = {
		  username: username,
		  chat_id: id,
		};

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
		  socket.emit('chatListOfUser', username);

		  // Return the data or a specific value from the response
		  return data; // You can return a specific field if needed
		} catch (error) {
		  console.error('Error:', error);
		  return "-1"; // Return "-1" or another specific value to indicate an error
		}
	  }

	useEffect(() => {

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
        if (props.showSubMenu !== "list") {
            props.setShowSubMenu("list");
      } else {
          props.setShowSubMenu("none");
      }
    }

	function checkIfWorked() {
		if (props.chatsOfUser.find((element) => element.id.toString() === id))
			setErrorMessage("")
		else
			setErrorMessage("You cannot access this channel, either because you entered a wrong password or because you're banned")
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
				{id === "" ? <span>Choose a channel to join</span> : <span>Do you want to join "{chanToJoin.name}" ?</span>}
				{chanToJoin.type === "protected by password" && <input
					type="password"
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					/>}
				</div>
				{ id !== "" && <button onClick={() => {DealWithIdChat(); setId("")}}>Join</button>}
			</div>
			<hr/>
            {availableChannels.filter(isNotAlreadyIn).map((chan) => {return (
			<div className="channelItem" key={chan.id}>
				<p onClick={() => {setId(chan.id.toString()); setChanToJoin(chan)}}>{chan.name}</p>
				{chan.type === "protected by password" && <LockIcon />}
			</div>
			)
			})}
			{errorMessage !== "" ?
			<div>
				<hr/>
				<p>{errorMessage}</p>
			</div> : <div></div>}
        </div> : <div></div>}
    </div>
    );
}
