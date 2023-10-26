import React from 'react';

export interface IGameContextProps {
	roomName:string;
	setRoomName: (roomName:string) => void;
	gameWidth:number;
	setGameWidth: (gameWidth:number) => void;
	gameHeight:number;
	setGameHeight: (gameHeight:number) => void;
	playerName:string;
	setPlayerName: (playerName:string) => void;
};

const defaultState:IGameContextProps = {
	roomName: '',
	setRoomName: () => {},
	gameWidth:800,
	setGameWidth:() => {},
	gameHeight:400,
	setGameHeight: () => {},
	playerName:'',
	setPlayerName: () => {},
};

export default React.createContext(defaultState);