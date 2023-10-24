import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../../context/chatContext";
import  ConnectionContext from "../../context/authContext"
import ChatContext from '../../Chat/contexts/ChatContext';
import "./Channels.scss"

type JoinChatRoomPayload = {
	id: string;
	username: string;
	user_role: string;
}

const Channels = () => {

    const socket = useContext(WebsocketContext);
	const [idChatRoom, setIdChatRoom] = useState<JoinChatRoomPayload[]>([]);
	const {login} = useContext(ConnectionContext);
	const {setChatId} = useContext(ChatContext);
	const [id, setId] = useState('');

	useEffect(() => {
		socket.on('onJoinChatRoom', (idChatRoom: JoinChatRoomPayload) => {
			console.log('onJoinChatRoom event received!');
			console.log(idChatRoom.id);
			if (idChatRoom.id === '-1')
			{
				console.log("wrong id")
				setId('Doesnt exist')
			}
			else{
				setChatId(parseInt(idChatRoom.id));
				console.log("id chat room", idChatRoom.id);
				setIdChatRoom((prev) => [...prev, idChatRoom]);
			}
		  });
		  return () => {
			console.log('Unregistering Events...');
			socket.off('onJoinChatRoom');
		};
	}, []);
	const SendIdChat = () => {
		const messageData = {
			login: login,
			chat_id: id,
			user_role: "user",
		}
		console.log("send id chat")
		console.log("id chat room", id);
		socket.emit('JoinChatRoom', messageData);
	}
    return (
        <div className="Channels">
            <p>Enter the id chat room you want to join</p>
				  <input
					type="text"
					value={id}
					onChange={(e) => setId(e.target.value)}
				  />
				  <button onClick={SendIdChat}>Join</button>
        </div>
    );
}

export default Channels;