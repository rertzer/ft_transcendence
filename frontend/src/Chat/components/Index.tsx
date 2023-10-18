
import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../contexts/ChatContext";
import ChatContext from "../contexts/ChatContext";

type JoinChatRoomPayload = {
	id: string;
	username: string;
	user_role: string;
}
//channel_id : number, user_id : number, user_role:string, date_joined:Date, date_left:Date | null
//
export const Index = () => {
	const [value, setValue] = useState('');
	const {username, isInChat, setChatId, setIsInChat, setIsInMp, setIsInMailbox } = useContext(ChatContext)
	const socket = useContext(WebsocketContext);
	const [showJoinChatOptions, setShowJoinChatOptions] = useState(false);
	const[showCreateChatOptions, setShowCreateChatOptions] = useState(false);
	const [id, setId] = useState('');
	const [idChatRoom, setIdChatRoom] = useState<JoinChatRoomPayload[]>([]);

	console.log("username", username)
	useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
    });
	socket.on('onJoinChatRoom', (idChatRoom: JoinChatRoomPayload) => {
	  console.log('onJoinChatRoom event received!');
	  console.log(idChatRoom.id);
	  if (idChatRoom.id === '-1')
	  {
		  console.log("wrong id")
	  }
	  else{
		  setChatId(parseInt(idChatRoom.id));
		  setIdChatRoom((prev) => [...prev, idChatRoom]);
		  setIsInChat(true);
		  setId('');
	  }
	  console.log("is in chat = ", isInChat);
	},);
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
	  socket.off('onJoinChatRoom');
    };
  }, []);

  const onSubmit = () => {
	const messageData = {
		username: username,
    	content: value,
	}
	socket.emit('newMessage', messageData);
    setValue('');
  };
  const createNewChat = () => {
	  console.log("create new chat")
	  setShowCreateChatOptions(true);
  	setShowJoinChatOptions(false);
	};
	const joinAchat = () => {
		console.log("join a chat")
		setShowCreateChatOptions(false);
		setShowJoinChatOptions(true);
	};
	const SendIdChat = () => {
		const messageData = {
			username: username,
			id: id,
			user_role: "user",
		}
		console.log("send id chat")
		socket.emit('JoinChatRoom', messageData);
	}
	return (
		<div>
		  <div>
			<h1>Welcome to the chat of transcendance</h1>
			<p>What do you want to do?</p>
			<div>
			  <button onClick={createNewChat}>Create new chat</button>
			  <button onClick={joinAchat}>Join a chat</button>
			  <button onClick={() => setIsInMailbox(true)}>See my private Msg</button>
			  <button onClick={() => setIsInMp(true)}>Send a Private msg</button>
			  {showCreateChatOptions && (
				<div>
				  <p>Welcome to a new chat</p>
				</div>
			  )}
			  {showJoinChatOptions && (
				<div>
				<p>Enter the id chat room you want to join</p>
				  <input
					type="text"
					value={id}
					onChange={(e) => setId(e.target.value)}
				  />
				  <button onClick={SendIdChat}>Join</button>
				  <p>Chat room number {id}</p>
				</div>
			  )}
			</div>
		  </div>
		</div>
	  );
}

