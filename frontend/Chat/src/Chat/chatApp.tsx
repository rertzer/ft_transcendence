import {IChatContext, WebsocketProvider, socket } from './contexts/ChatContext';
import { Index } from './components/Index';
import ChatContext from './contexts/ChatContext';
import { InChat } from './components/chat';
import { useState } from 'react';
{}

export function ChatApp() {
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
			{!isInChat && <Index />}
			{isInChat && <InChat />}
		</ChatContext.Provider>
	</WebsocketProvider>
	)
}
