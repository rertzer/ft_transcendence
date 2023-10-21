import {IChatContext, WebsocketProvider, socket } from './contexts/ChatContext';
import { Index } from './components/Index';
import ChatContext from './contexts/ChatContext';
import { InChat } from './components/chat';
import { useState } from 'react';
import { MsgPrive } from './components/msgPrive';
import { Connection } from './components/connection';
import { Mailbox } from './components/mailbox';
import { CreateChat } from './components/createChat';

export function ChatApp() {
	const [username, setUsername] = useState('')
	const [isInChat, setIsInChat] = useState(false)
	const [isInMp, setIsInMp] = useState(false)
	const [isConnected, setIsConnected] = useState(false)
	const [isInMailbox, setIsInMailbox] = useState(false)
	const [chatId, setChatId] = useState(-1)
	const [InCreateChat, setInCreateChat] = useState(false)
	const ChatContextValue :IChatContext = {
		chatId,
		setChatId,
		username,
		setUsername,
		isConnected,
		setIsConnected,
		isInChat,
		setIsInChat,
		isInMp,
		setIsInMp,
		isInMailbox,
		setIsInMailbox,
		InCreateChat,
		setInCreateChat,
	};
	return (
		<WebsocketProvider value={socket}>
			<ChatContext.Provider value={ChatContextValue}>
			{!isConnected && <Connection />}
			{!isInChat && !isInMp && !isInMailbox && isConnected &&  <Index />}
			{InCreateChat && <CreateChat />}
			{isInMailbox && <Mailbox />}
			{isInChat && <InChat />}
			{isInMp && <MsgPrive />}
		</ChatContext.Provider>
		</WebsocketProvider>
	)
}
