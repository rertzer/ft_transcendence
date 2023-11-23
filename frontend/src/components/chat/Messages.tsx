import { useEffect, useRef } from 'react';
import Message from "./Message";
import "./Messages.scss";
import { useContext, useState } from 'react';
import chatContext, { WebsocketContext } from "../../context/chatContext";
import { useLogin } from "../../components/user/auth";

type ChatMessage = {
	msg: string;
	username: string;
	login: string;
	date: string;
	id: number;
	chatId: number;
	serviceMessage: boolean;
	userId: number; // a ajouter !
}

const Messages = (props: {chatId: number, isOwner: boolean, isAdmin: boolean, setIsAdmin: Function, isDM: boolean}) => {
	const auth = useLogin();
	const [render, setRender] = useState(false);
	const socket = useContext(WebsocketContext);
	const { blockedUsers } = useContext(chatContext)
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const [chatMessages,setChatMessages] = useState<ChatMessage[]>([]);

	useEffect(() => {
			socket.on('chatMsgHistory', (chatHistoryReceive : ChatMessage[]) => {
			setChatHistory(chatHistoryReceive);
			setRender(true);
		});
		socket.on('newMessage', (chatHistoryReceive :{msg: string, username: string, login: string, date: Date, id: number, idOfChat:number, serviceMessage: boolean, userId: number}) => {
			console.log("receive a new message :", chatHistoryReceive);
			let newDateString = chatHistoryReceive.date.toString();
			newDateString = newDateString.slice(newDateString.indexOf("T") + 1, newDateString.indexOf("T") + 9);
			const add : ChatMessage = {msg: chatHistoryReceive.msg, username: chatHistoryReceive.username, login: chatHistoryReceive.login, date: newDateString, id: chatHistoryReceive.id, chatId: chatHistoryReceive.idOfChat, serviceMessage: chatHistoryReceive.serviceMessage, userId: chatHistoryReceive.userId}
			setChatMessages((prevMessages) => [...prevMessages, add]);
			if (blockedUsers.find(element => element === chatHistoryReceive.userId) === undefined)
				socket.emit("chatListOfUser",auth.user.login);
			if (props.isAdmin === false && add.serviceMessage === true && add.msg === auth.user.username + " is now an administrator of this channel")
				props.setIsAdmin(true);
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
					const add : ChatMessage = {msg: element.msg, username: element.username, login: element.login, date: newDateString, id: element.id, chatId: element.chatId, serviceMessage: element.serviceMessage, userId: element.userId}
					setChatMessages((prevMessages) => [...prevMessages, add]);
				}
			setRender(false);
		}
	}, [chatHistory]);

	useEffect(() => {
		setChatMessages([]);
	}, [props.chatId])

	const endRef = useRef<HTMLDivElement>(null);

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
						{chatMessages.map((message) => {
							if (blockedUsers.find(element => element === message.userId) === undefined) {
							return (
							<div key={message.date + message.id} className="messageUnit">
								{message.chatId === props.chatId && (
									 <Message date={message.date}
									 	username={message.username}
										login={message.login} msg={message.msg}
										isOwner={props.isOwner}
										isAdmin={props.isAdmin}
										chatId={props.chatId}
										service={message.serviceMessage}
										isDM={props.isDM}
										msgId={message.id}/>
								)}
							</div>)
							}
			  			})}
			  		</div>
				)}
				<div ref={endRef} />
		</div>
    )
}


export default Messages;
