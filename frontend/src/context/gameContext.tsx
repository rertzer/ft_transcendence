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
	nbBalls: number;
	setNbBalls: (nbBalls:number) => void;
	modeGame: string;
	setModeGame: (modeGame:string) => void;
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
	nbBalls: 1,
	setNbBalls: () => {}, 
	modeGame: '',
	setModeGame: () => {}
};

export default React.createContext(defaultState);