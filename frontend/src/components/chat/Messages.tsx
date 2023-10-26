import { useEffect, useRef } from 'react';
import Message from "./Message";
import "./Messages.scss";
import { useContext, useState } from 'react';
import { WebsocketContext } from "../../context/chatContext";
import userEvent from '@testing-library/user-event';
import  ConnectionContext from "../../context/authContext"

type ChatHistory = {
	msg: string;
	username: string;
	date: string;
	id: number;
}

type trigger = {
	chatId : number;
	numberMsgToDisplay: number;
}

const Messages = (props: {chatId: number, isOwner: boolean, isAdmin: boolean}) => {

	const {username} = useContext(ConnectionContext);
	const socket = useContext(WebsocketContext);
	const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
	const [toTrigger, setTrigger] = useState<trigger>({numberMsgToDisplay: 15, chatId: props.chatId});

	useEffect(() => {

		funcTrigger();

		socket.on('retrieveMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number}) => {
			console.log("trigger reterieve message, what i receive :", chatHistoryReceive)
			let newDateString = chatHistoryReceive.date.toString();
			newDateString = newDateString.slice(newDateString.indexOf("T") + 1, newDateString.indexOf("T") + 9);
			const add : ChatHistory = {msg: chatHistoryReceive.msg, username: chatHistoryReceive.username, date: newDateString, id: chatHistoryReceive.id}
			setChatHistory((prevMessages) => [...prevMessages, add]);
			// Debugging: Check the updated chatHistory
		});
		socket.on('newMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number}) => {

			let newDateString = chatHistoryReceive.date.toString();
			newDateString = newDateString.slice(newDateString.indexOf("T") + 1, newDateString.indexOf("T") + 9);
			const add : ChatHistory = {msg: chatHistoryReceive.msg, username: chatHistoryReceive.username, date: newDateString, id: chatHistoryReceive.id}
			setChatHistory((prevMessages) => [...prevMessages, add]);
			console.log("cat id : ", chatHistoryReceive.id);
			// Debugging: Check the updated chatHistory
		});
		return () => {
			console.log('Unregistering Events...');
		}
	}, [])

	useEffect(() => {
		console.log("hey i am trigger")
		setChatHistory([]);
	}, [props.chatId])


	const funcTrigger = ()  => {
		console.log("object send :", toTrigger)
		socket.emit('retrieveMessage', toTrigger );
	}

	const endRef = useRef<HTMLDivElement>(null); //ref to empty div to autoscroll to bottom

	useEffect(() => {
		if (chatHistory.length > 0) {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	}, [chatHistory.length]);

    return (
        <div className='messages'>
			{chatHistory.length === 0 ? (
				<div>No messages</div>
				) : (
					<div>
						{chatHistory.map((chat) => (
							<div key={chat.id}>
				 				 <Message date={chat.date} username={chat.username} msg={chat.msg} isOwner={props.isOwner} isAdmin={props.isAdmin}/>
							</div>
			  			))}
			  		</div>
				)}
				<div ref={endRef} />
		</div>
    )
}

export default Messages;
