import { useEffect, useRef } from 'react';
import Message from "./Message";
import "./Messages.scss";
import { useContext, useState } from 'react';
import { WebsocketContext } from "../../context/chatContext";
import userEvent from '@testing-library/user-event';
import  ConnectionContext from "../../context/authContext"
import { Console } from 'console';
import { render } from '@testing-library/react';

type ChatHistory = {
	msg: string;
	username: string;
	date: string;
	id: number;
	chatId: number;
}

type ChatMessage = {
	msg: string;
	username: string;
	date: string;
	id: number;
}

type trigger = {
	chatId : number;
	numberMsgToDisplay: number;
}

const Messages = (props: {chatId: number}) => {

	const {username} = useContext(ConnectionContext);
	const [render, setRender] = useState(false);
	const socket = useContext(WebsocketContext);
	const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
	const [chatMessages,setChatMessages] = useState<ChatMessage[]>([]);
	const [toTrigger, setTrigger] = useState<trigger>({numberMsgToDisplay: 15, chatId: props.chatId});

	useEffect(() => {

			socket.on('chatMsgHistory', (chatHistoryReceive : ChatHistory[]) => {
			console.log("trigger reterieve message, what i receive :", chatHistoryReceive)
			setChatHistory(chatHistoryReceive);
			console.log(chatHistory);
			setRender(true);

		});
		socket.on('newMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number, idOfChat:number}) => {
			console.log("chatHistoryReceive.idOfChat : ", chatHistoryReceive.idOfChat, "props.chatId : ", props.chatId)
			if (chatHistoryReceive.idOfChat === props.chatId)
			{
				let newDateString = chatHistoryReceive.date.toString();
				newDateString = newDateString.slice(newDateString.indexOf("T") + 1, newDateString.indexOf("T") + 9);
				const add : ChatMessage = {msg: chatHistoryReceive.msg, username: chatHistoryReceive.username, date: newDateString, id: chatHistoryReceive.id}
				setChatMessages((prevMessages) => [...prevMessages, add]);
				console.log("cat id : ", chatHistoryReceive.id);
				// Debugging: Check the updated chatHistory
			}
		});
		return () => {
			console.log('Unregistering Events...');
			socket.off('chatMsgHistory');
			socket.off('newMessage');
		}
	}, [])

	useEffect(() => {
		if (render == true)
		{
			for (const element of chatHistory)
				{
					console.log("yo tesytt");
					let newDateString = element.date.toString();
					newDateString = newDateString.slice(newDateString.indexOf("T") + 1, newDateString.indexOf("T") + 9);
					const add : ChatMessage = {msg: element.msg, username: element.username, date: newDateString, id: element.id}
					setChatMessages((prevMessages) => [...prevMessages, add]);
				}
				console.log("fuckkk	")
			setRender(false);
		}
	}, [chatHistory]);

	useEffect(() => {
		console.log("hey i am trigger")
		setChatMessages([]);
	}, [props.chatId])

	const endRef = useRef<HTMLDivElement>(null); //ref to empty div to autoscroll to bottom

	useEffect(() => {
		if (chatMessages.length > 0) {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
		console.log("chatMessages.length : ", chatMessages.length)
	}, [chatMessages.length]);

    return (
        <div className='messages'>
			{chatMessages.length === 0 ? (
				<div></div>
				) : (
					<div>
						{chatMessages.map((chat) => (
							<div key={chat.id}>
				 				 <Message date={chat.date} username={chat.username} msg={chat.msg}/>
							</div>
			  			))}
			  		</div>
				)}
				<div ref={endRef} />
		</div>
    )
}

export default Messages;
