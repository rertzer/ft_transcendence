import React from 'react';

export interface IGameContextProps {
	isInRoom:boolean;
	setInRoom: (inRoom:boolean) => void;
	gameWidth:number;
	setGameWidth: (gameWidth:number) => void;
	gameHeight:number;
	setGameHeight: (gameHeight:number) => void;
	playerName:string;
	setPlayerName: (playerName:string) => void;
	playerSide:string;
	setPlayerSide: (playerSide:string) => void;
	opponentName:string;
	setOpponentName: (opponentName:string) => void;
};

const defaultState:IGameContextProps = {
	isInRoom: false,
	setInRoom: () => {},
	gameWidth:800,
	setGameWidth:() => {},
	gameHeight:400,
	setGameHeight: () => {},
	playerName:'',
	setPlayerName: () => {},
	playerSide:'',
	setPlayerSide: () => {},
	opponentName:'',
	setOpponentName: () => {},
};

export default React.createContext(defaultState);