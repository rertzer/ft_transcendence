import React, { useEffect } from 'react';
import Message from "./Message";
import "./Messages.scss";
import { useContext, useState } from 'react';
import { WebsocketContext } from "../../context/chatContext";
import ChatContext from '../../Chat/contexts/ChatContext';


type ChatHistory = {
	msg: string;
	username: string;
	date: string;
	id: number;
}

type trigger = {
	chatId : string;
	numberMsgToDisplay: number;
}

const Messages = () => {

	const socket = useContext(WebsocketContext);

	const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
	const {chatId} = useContext(ChatContext)
	const [toTrigger, setTrigger] = useState<trigger>({numberMsgToDisplay: 15, chatId: '1'});

	useEffect(() => {
		socket.on('retrieveMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number}) => {
			console.log("trigger reterieve message, what i receive :", chatHistoryReceive)
			const newDateString = chatHistoryReceive.date.toString();
			const add : ChatHistory = {msg: chatHistoryReceive.msg, username: chatHistoryReceive.username, date: newDateString, id: chatHistoryReceive.id}
			console.log("hey ")
			console.log("Previous catHistory:", chatHistory);
			setChatHistory((prevMessages) => [...prevMessages, add]);
			// Debugging: Check the updated chatHistory
			console.log("Updated chatHistory:", chatHistory);
		});
		return () => {
			console.log('Unregistering Events...');
			socket.off('retrieveMessage');
		};
	}, [])


	const funcTrigger = ()  => {
		console.log("object send :", toTrigger)
		socket.emit('retrieveMessage', toTrigger ); // need to be chat id

		return (<div></div>);
	}

    return (
        <div className='messages'>
			{funcTrigger()}
			{chatHistory.length === 0 ? (
				<div>No Messages</div>
				) : (
					<div>
						{chatHistory.map((chat) => (
							<div key={chat.id}>
				 				 <Message date={chat.date} username={chat.username} msg={chat.msg}/>
							</div>
			  			))}
			  		</div>
				)}
        </div>
    )
}

export default Messages;
