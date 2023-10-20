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
	date: string;
	id: number;
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

		  socket.on('retrieveMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number}) => {
				console.log("trigger reterieve message, what i receive :", chatHistoryReceive)
				const newDateString = chatHistoryReceive.date.toString();
				const add : ChatHistory = {msg: chatHistoryReceive.msg, username: chatHistoryReceive.username, date: newDateString, id: chatHistoryReceive.id}
				//console.log("Previous catHistory:", chatHistory);
				setChatHistory((prevMessages) => [...prevMessages, add]);
				// Debugging: Check the updated chatHistory
				//console.log("Updated chatHistory:", chatHistory);
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
		{chatHistory.length === 0 ? (
			<div>No Messages</div>
		  ) : (
			<div>
			  {chatHistory.map((chat) => (
				<div key={chat.id}>
				  <p>{chat.date} :  {chat.username} : {chat.msg}</p>
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
