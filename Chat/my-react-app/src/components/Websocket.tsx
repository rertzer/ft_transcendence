import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { WebsocketContext } from "../contexts/websocketContext";


type MessagePayload ={
	content: string;
	message: string;
	user: string;
}
let name: string = '';

export const Websocket = () => {

	const [value, setValue] = useState('')
	const socket = useContext(WebsocketContext);
	const [messages, setMessages] = useState<MessagePayload[]>([]);
	const [userName, setUserName] = useState('');



	useEffect(() => {
		name = prompt('Enter your name: ') || '';
		if (name) {
		setUserName(name);
		}
		socket.on('connect', () => {
			console.log('connected');
		});
		socket.on('onMessage', (newMessage: MessagePayload) => {
			console.log("on message event reveived");
			console.log(newMessage);
			setMessages((prev) => [...prev, newMessage])
		});
		return() => {
			console.log("Unregistering event...");
			socket.off('connect');
			socket.off('onMessage');
		}
	}, [])

	const onSummit = () => {
		socket.emit('newMessage', value);
		setValue('');
	};
	const handleNewMessage = () => {
		if (name && value) {
		  // Send a new message to the server with the user's name
		  socket.emit('newMessage', { username: name, content: value });
		  setValue('');
		}
	  };

	return (
		<div>
			<div>
				<h1>WebSocket Component</h1>
				<div>
					{messages.length === 0 ? <div>No Messages</div> : <div>
						{/* here we need to insert unique key per message thnks to the data base */}
					{messages.map((msg) => <div>
					<p>{msg.content}</p>
					</div>
					)}
					</div>
					}
				</div>
				<div>
						<input type="text" value = {value} onChange={(e) => setValue(e.target.value)}
						/>
						<button onClick={() => socket.emit('newMessage', value)}>Submit</button>
				</div>
			</div>
		</div>
	);
};
