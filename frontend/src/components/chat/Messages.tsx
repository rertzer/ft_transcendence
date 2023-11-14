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
	serviceMessage: boolean;
}

type ChatMessage = {
	msg: string;
	username: string;
	date: string;
	id: number;
	chatId: number;
	serviceMessage: boolean;
}

type trigger = {
	chatId : number;
	numberMsgToDisplay: number;
}

const Messages = (props: {chatId: number, isOwner: boolean, isAdmin: boolean, isDM: boolean}) => {

	const {username} = useContext(ConnectionContext);
	const [render, setRender] = useState(false);
	const socket = useContext(WebsocketContext);
	const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
	const [chatMessages,setChatMessages] = useState<ChatMessage[]>([]);
	const [toTrigger, setTrigger] = useState<trigger>({numberMsgToDisplay: 15, chatId: props.chatId});

	useEffect(() => {
			socket.on('chatMsgHistory', (chatHistoryReceive : ChatHistory[]) => {

			setChatHistory(chatHistoryReceive);

			setRender(true);

		});
		socket.on('newMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number, idOfChat:number, serviceMessage: boolean}) => {

			let newDateString = chatHistoryReceive.date.toString();
			newDateString = newDateString.slice(newDateString.indexOf("T") + 1, newDateString.indexOf("T") + 9);
			const add : ChatMessage = {msg: chatHistoryReceive.msg, username: chatHistoryReceive.username, date: newDateString, id: chatHistoryReceive.id, chatId: chatHistoryReceive.idOfChat, serviceMessage: chatHistoryReceive.serviceMessage}
			setChatMessages((prevMessages) => [...prevMessages, add]);
			socket.emit("chatListOfUser",username);
		});
		return () => {

			socket.off('chatMsgHistory');
			socket.off('newMessage');
		}
	}, [])

	useEffect(() => {
		if (render === true)
		{
			for (const element of chatHistory)
				{

					let newDateString = element.date.toString();
					newDateString = newDateString.slice(newDateString.indexOf("T") + 1, newDateString.indexOf("T") + 9);
					const add : ChatMessage = {msg: element.msg, username: element.username, date: newDateString, id: element.id, chatId: element.chatId, serviceMessage: element.serviceMessage}
					setChatMessages((prevMessages) => [...prevMessages, add]);
				}

			setRender(false);
		}
	}, [chatHistory]);

	useEffect(() => {

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

	}, [chatMessages.length]);

	return (
        <div className='messages'>
			{chatMessages.length === 0 ? (
				<div></div>
				) : (
					<div className='messageArray'>

						{chatMessages.map((chat) => {
							return (
							<div key={chat.date + chat.id} className="messageUnit">
								{chat.chatId === props.chatId && (
									 <Message date={chat.date} username={chat.username} msg={chat.msg} isOwner={props.isOwner} isAdmin={props.isAdmin} chatId={props.chatId} service={chat.serviceMessage} isDM={props.isDM}/>
								)}
							</div>)
			  			})}
			  		</div>
				)}
				<div ref={endRef} />
		</div>
    )
}


export default Messages;
