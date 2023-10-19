import { WebsocketContext } from "../contexts/ChatContext";
import { useContext, useEffect, useState } from 'react';
import ChatContext from "../contexts/ChatContext";
type MessagePayload = {
	content: string;
	msg: string;
	username: string;
	id: string;
  };

type ChatHistory = {
	msg: string;
	username: string;
}

export const InChat = () => {
	const [messages, setMessages] = useState<MessagePayload[]>([]);
	const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);
	const {username, setIsInChat, chatId} = useContext(ChatContext);
	useEffect(() => {
		socket.on('onMessage', (newMessage: MessagePayload) => {
			console.log('onMessage event received!');
			console.log(newMessage);
			setMessages((prev) => [...prev, newMessage]);
		  });
		  socket.on('retrieveMessage', (chatHistoryReceive :{msg: string, username: string}) => {
			  setChatHistory((prevMessages) => [...prevMessages, chatHistoryReceive]);
			  for (let i = 0; i < chatHistory.length; i++) {
				  console.log("Username: ",chatHistory[i].username, "Message: ", chatHistory[i].msg);
				}
			});
		return () => {
			console.log('Unregistering Events...');
			socket.off('onMessage');
			socket.off('retrieveMessage');
		};
	}, []);

	const onSubmit = () => {
		console.log ("id of chat", chatId)
		const messageData = {
			username: username,
			content: value,
			idOfChat: chatId,
		}
		socket.emit('newMessage', messageData);
		setValue('');
	  };
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
			<button onClick={() => setIsInChat(false)}>go chat</button>
		</div>
	)
}
