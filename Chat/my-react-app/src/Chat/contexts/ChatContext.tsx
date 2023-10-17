import React, { createContext } from "react";
import { io, Socket } from "socket.io-client";


export const socket = io('http://localhost:9001');
export const WebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebsocketContext.Provider;


export interface IChatContext {
	username: string,
	setUsername: (usemane: string) => void;
	isInChat:boolean,
	setIsInChat: (inchat: boolean) => void;
};

const defaultState:IChatContext = {
	username: '',
	setUsername: () => {},
	isInChat: false,
	setIsInChat: () => {},
};

export default React.createContext(defaultState);
