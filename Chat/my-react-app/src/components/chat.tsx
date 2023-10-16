import { WebsocketContext } from "../contexts/ChatContext";
import { useContext, useEffect, useState } from 'react';

type MessagePayload = {
	content: string;
	msg: string;
	username: string;
	id: string;
  };

export const InChat = () => {
	const [messages, setMessages] = useState<MessagePayload[]>([]);
	
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
		</div>
	)
}
