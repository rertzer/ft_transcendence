import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';


export const socket = io('http://localhost:4000', {
	//autoConnect:false
});
export const WebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebsocketContext.Provider;

export interface IChatContext {
	// isConnected:boolean,
	// setIsConnected: (isConnected: boolean) => void;
	// username: string,
	// setUsername: (usemane: string) => void;
	// isInChat:boolean,
	// setIsInChat: (inchat: boolean) => void;
	// isInMp:boolean,
	// setIsInMp: (inMp: boolean) => void;
	// isInMailbox:boolean,
	// setIsInMailbox: (inMailbox: boolean) => void;
	chatId: number,
	setChatId: (chatId: number) => void;
};

const defaultState:IChatContext = {
	// isConnected: false,
	// setIsConnected: () => {},
	// username: '',
	// setUsername: () => {},
	// isInChat: false,
	// setIsInChat: () => {},
	// isInMp: false,
	// setIsInMp: () => {},
	// isInMailbox: false,
	// setIsInMailbox: () => {},
	chatId: 0,
	setChatId: () => {},
};

export default React.createContext(defaultState);
