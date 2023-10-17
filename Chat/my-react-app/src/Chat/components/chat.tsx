import { WebsocketContext } from "../contexts/ChatContext";
import { useContext, useEffect, useState } from 'react';
import ChatContext from "../contexts/ChatContext";
type MessagePayload = {
	content: string;
	msg: string;
	username: string;
	id: string;
  };

export const InChat = () => {
	const [messages, setMessages] = useState<MessagePayload[]>([]);
	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);
	const {setUsername, username, setIsInChat} = useContext(ChatContext);

	useEffect(() => {
		socket.on('onMessage', (newMessage: MessagePayload) => {
			console.log('onMessage event received!');
			console.log(newMessage);
			setMessages((prev) => [...prev, newMessage]);
		  });
		  return () => {
			console.log('Unregistering Events...');
			socket.off('onMessage');
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
	const goBack = () => {
		setIsInChat(false);
	}
	return (
		<div>
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
			<button onClick={goBack}>Leave chat</button>
		</div>
	)
}
