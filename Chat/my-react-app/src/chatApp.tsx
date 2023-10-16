import {IChatContext, WebsocketProvider, socket } from './contexts/ChatContext';
import { Websocket, inChat } from './components/Websocket';
import ChatContext from './contexts/ChatContext';import { InChat } from './components/chat';
import { useState } from 'react';
{}

function ChatApp() {
	const [username, setUsername] = useState('')
	const [isInChat, setIsInChat] = useState(false)
	const ChatContextValue :IChatContext = {
		username,
		setUsername,
		isInChat,
		setIsInChat,
	};
	return (
		<WebsocketProvider value={socket}>
			<ChatContext.Provider value={ChatContextValue}>
			{!isInChat && <Websocket />}
			{isInChat && <InChat />}
		</ChatContext.Provider>
	</WebsocketProvider>
	)
}
