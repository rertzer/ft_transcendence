
import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../contexts/ChatContext";

type MessagePayload = {
  content: string;
  msg: string;
  username: string;
  id: string;
};

type JoinChatRoomPayload = {
	id: string;
}
export const inChat = false;

export const Websocket = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [username, setUserName] = useState('')
  const socket = useContext(WebsocketContext);
  const [showJoinChatOptions, setShowJoinChatOptions] = useState(false);
	const[showCreateChatOptions, setShowCreateChatOptions] = useState(false);
	const [id, setId] = useState('');
	const [idChatRoom, setIdChatRoom] = useState<JoinChatRoomPayload[]>([]);

	useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
    });

    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      console.log(newMessage);
      setMessages((prev) => [...prev, newMessage]);
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
			  onChange={(e) => setUserName(e.target.value)}
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
				  {messages.length === 0 ? (
					<div>No Messages</div>
				  ) : (
					<div>
					  {messages.map((msg) => (
						<div key={msg.id}>
						  <p>{msg.username} : {msg.content}</p>
						</div>
					  ))}
					</div>
				  )}
				  <div>
					<p>Your message</p>
					<input
					  type="text"
					  value={value}
					  onChange={(e) => setValue(e.target.value)}
					/>
				  </div>
				  <button onClick={onSubmit}>Submit</button>
				</div>
			  )}
			</div>
		  </div>
		</div>
	  );
}

