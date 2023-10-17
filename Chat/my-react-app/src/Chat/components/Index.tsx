
import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../contexts/ChatContext";
import ChatContext from "../contexts/ChatContext";

type MessagePayload = {
  content: string;
  msg: string;
  username: string;
  id: string;
};

type JoinChatRoomPayload = {
	id: string;
}

export const Index = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const {setUsername, username, isInChat, setIsInChat } = useContext(ChatContext)
  const socket = useContext(WebsocketContext);
  const [showJoinChatOptions, setShowJoinChatOptions] = useState(false);
	const[showCreateChatOptions, setShowCreateChatOptions] = useState(false);
	const [id, setId] = useState('');
	const [idChatRoom, setIdChatRoom] = useState<JoinChatRoomPayload[]>([]);
	useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
    });
	socket.on('onJoinChatRoom', (idChatRoom: JoinChatRoomPayload) => {
	  console.log('onJoinChatRoom event received!');
	  console.log(idChatRoom.id);
	  setIdChatRoom((prev) => [...prev, idChatRoom]);
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
		console.log("send id chat")
		socket.emit('JoinChatRoom', parseInt(id));
		setIsInChat(true);
		setId('');
	}
	return (
		<div>
		  <div>
			<h1>Welcome to the chat of transcendance</h1>
			<p>Enter your username</p>
			<input
			  type="text"
			  value={username}
			  onChange={(e) => setUsername(e.target.value)}
			/>
			<p>What do you want to do?</p>
			<div>
			  <button onClick={createNewChat}>Create new chat</button>
			  <button onClick={joinAchat}>Join a chat</button>
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

