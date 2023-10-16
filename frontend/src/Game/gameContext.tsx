import React from 'react';
import { IBall, IGameParam, IPlayer } from './components/gameArea/interfacesGame';

export interface IGameContextProps {
	isInRoom:boolean;
	setInRoom: (inRoom:boolean) => void;
	gameWidth:number;
	setGameWidth: (gameWidth:number) => void;
	gameHeight:number;
	setGameHeight: (gameHeight:number) => void;
	pong:IGameParam;
	setPong: (pong:IGameParam) => void;
	player1: IPlayer;
	setPlayer1: (player1: IPlayer) => void;
	player2: IPlayer;
	setPlayer2: (player2: IPlayer) => void;
	ball: IBall;
	setBall: (ball: IBall) => void;

};

const defaultState:IGameContextProps = {
	isInRoom: false,
	setInRoom: () => {},
	gameWidth:800,
	setGameWidth:() => {},
	gameHeight:400,
	setGameHeight: () => {},
	pong:{
		ballRadius: 0.01,
		paddleWidth: 0.02,
		paddleHeight: 0.25,
		netWidth: 0.005,
		netHeight: 0.05,
		netInterval: 0.025,
		backColor: '#000000',
		ballColor: '#f2c546',
		netColor: '#FFFFFF',
		scoreColor: '#FFFFFF',
		scoreFont: 'sans-serif',
		scoreFontDecoration: '',
		scoreFontPx: 0.07,
		nameFont: 'sans-serif',
		nameFontDecoration: 'italic',
		nameFontPx: 0.05,
		nameColor: '#FFFFFF',
		ballInitSpeed: 0.006,
		ballInitDir: {x: 0.5, y: -1},
		ballSpeedIncrease: 0.2,
		paddleSpeed: 0.01,
		play: true,
		menuBackColor: 'rgba(255,255,255,0.8)',
		menuTextColor: '#000000',
		menuFont: 'sans-serif',
		menuFontDecoration: 'bold',
		menuFontPx: 0.07,
		goal: 3,
		endgame: false,},
	setPong: () => {},
	player1: {
		pos: {x:0, y: 0.5 - 0.25 / 2},
		score: 0,
		scorePos: {x: 1 / 4, y: 1 / 5},
		upArrowDown:false,
		downArrowDown:false,
		name:"Player 1",
		namePos:{x: 1 / 4, y: 0.9},
		color:'#16B84E'
	},
	setPlayer1: () => {},
	player2: {
		pos: {x: 1 - 0.02, y: (0.5 - 0.25 / 2)}, 
		score: 0,
		scorePos: {x: 3 / 4, y: 1 / 5}, 
		upArrowDown:false,
    	downArrowDown:false,
		name: "Player 2",
		namePos: {x: 3 / 4, y: 0.9},
		color: '#BB0B0B'
	},
	setPlayer2: () => {},
	ball: {
		pos: {x: 1 / 2, y: 1 / 2}, 
		speed: 0.006,
		dir:  {x: 0.5, y: -1},
	},
	setBall: () => {},
};

export default React.createContext(defaultState);