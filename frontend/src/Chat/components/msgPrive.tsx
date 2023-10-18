import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../contexts/ChatContext";
import ChatContext from "../contexts/ChatContext";

type MsgPrivate = {
	msg: string;
	loginToSend: string;
	idOfUser: string;
  };

export const MsgPrive = () => {
	const [messages, setMessages] = useState<MsgPrivate[]>([]);
	const [value, setValue] = useState('');
	const [loginToSend, setloginToSend] = useState('');
	const {username, setIsInMp} = useContext(ChatContext);
	const socket = useContext(WebsocketContext);

	console.log("username", username)
	useEffect(() => {
		socket.on('SendPrivateMessage', (newMessage: MsgPrivate) => {
			console.log('onMessage event received!');
			console.log(newMessage);
			setMessages((prev) => [...prev, newMessage]);
		  });
		  return () => {
			console.log('Unregistering Events...');
			socket.off('SendPrivateMessage');
		  };
	}, []);

	const sendPrivateMsg = () => {
		console.log("loginToSend", loginToSend)
		console.log("value", value)
		console.log("username", username)
		const messageData = {
			msg: value,
			loginToSend: loginToSend,
			idOfUser: username,
		}
		console.log("send private msg", messageData)
		socket.emit('SendPrivateMessage', messageData);
		setValue('');
		setloginToSend('');
	}
	return (
		<div>
			<div>
				<p>Send a private msg</p>
				<p>login to send</p>
				<input
					type="text"
					value={loginToSend}
					onChange={(e) => setloginToSend(e.target.value)}
				/>
				<p>msg to send : </p>
				<input
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<button onClick={sendPrivateMsg }>Send</button>
				<button onClick={() => setIsInMp(false)}>Go back</button>
			</div>
		</div>
	);
  }

