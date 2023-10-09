import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { WebsocketContext } from "../contexts/websocketContext";


type MessagePayload ={
	content: string;
	message: string;
}

export const Websocket = () => {

	const [value, setValue] = useState('')
	const socket = useContext(WebsocketContext);
	const [messages, setMessages] = useState<MessagePayload[]>([]);

	useEffect(() => {
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
