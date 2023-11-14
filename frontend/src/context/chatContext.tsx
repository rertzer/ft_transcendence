import React, { createContext, useContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Channel } from '../components/chat/ChatComponent';


export const socket = io('http://localhost:4000', {
	// we need this socket to not connect until someone il log
	autoConnect:false
});
export const WebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebsocketContext.Provider;


export interface IChatContext {
	allChannels: Channel[],
	setAllChannels: (allChannels: Channel[]) => void;
	activeChannel: Channel,
	setActiveChannel: (activeChannel: Channel) => void;
};

const defaultState:IChatContext = {
	allChannels: [],
	setAllChannels: () => {},
	activeChannel: {
		id: -1,
		channelName: "Pong Chat",
		chatPicture: "",
		type: "",
		status: "",
		username: null,
		dateSend: null,
		msg: null
	},
	setActiveChannel: () => {}
};

export default React.createContext(defaultState);
