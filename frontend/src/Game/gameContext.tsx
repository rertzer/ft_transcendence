import React from 'react';

export interface IGameContextProps {
	isInRoom:boolean;
	setInRoom: (inRoom:boolean) => void;
	gameWidth:number;
	setGameWidth: (gameWidth:number) => void;
	gameHeight:number;
	setGameHeight: (gameHeight:number) => void;
};

const defaultState:IGameContextProps = {
	isInRoom: false,
	setInRoom: () => {},
	gameWidth:800,
	setGameWidth:() => {},
	gameHeight:400,
	setGameHeight: () => {}
};

export default React.createContext(defaultState);