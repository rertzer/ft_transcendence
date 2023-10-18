import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../contexts/ChatContext";
import ChatContext from "../contexts/ChatContext";

type Mailbox = {
	msg: string;
	content: string;
	sender: string;
};
//json parse
//
export const Mailbox = () => {

	const {username, setIsInMailbox} = useContext(ChatContext);
	const socket = useContext(WebsocketContext);
	const [message, setMessage] = useState<Mailbox[]>([]);

	useEffect(() => {
		checkMailBox();
		socket.on('onMailBox', (messageReceived: { msg: string, content: string, sender: string}) => {
			console.log('message received!  :', messageReceived);
			setMessage((prevMessages) => [...prevMessages, messageReceived]);
			for (let i = 0; i < message.length; i++) {
				console.log(message[i].content);
			}
		});
		  return () => {
			console.log('Unregistering Events...');
			socket.off('onMailBox');
		  };
	}, []);
	useEffect(() => {
		// This effect runs whenever `message` is updated
		for (let i = 0; i < message.length; i++) {
		  console.log(message[i].content);
		}
	  }, [message]);

	const checkMailBox = () => {
		socket.emit('onMailBox', username);
	}

	return (
		<div>
			<div>
				{message.map((msg) => (
					<div key={msg.msg}>
						<p>{msg.sender} : {msg.content}</p>
					</div>
				))}
				<button onClick={() => setIsInMailbox(false)}>Go back</button>
			</div>
		</div>
	)
}
