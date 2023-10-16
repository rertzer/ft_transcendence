import React, {useEffect, useState} from 'react';
import socketService from './services/socketService';
import { JoinRoom } from './components/joinRoom';
import GameContext, { IGameContextProps } from './gameContext';
import GameArea from './components/gameArea';
import { io } from 'socket.io-client';

const connectSocket = async () => {
	const socket = await socketService.connect('http://localhost:4000')
	.then((s) => {console.log("Connected with socket: ", s.id);})
	.catch((error) => {
		console.log("Error: ", error);
	});
};

function Game() {
	const [isInRoom, setInRoom] = useState(false);
	const [playerName, setPlayerName] = useState('');
	const [playerSide, setPlayerSide] = useState('');
	const [opponentName, setOpponentName] = useState('');
	const [gameWidth, setGameWidth] = useState(0);
	const [gameHeight, setGameHeight] = useState(0);

	useEffect(() => {
		connectSocket();
		const width = window.innerWidth * 0.9;
		setGameWidth(width);
		setGameHeight((window.innerWidth * 0.9) /2);
	}, []);
	
	const gameContextValue :IGameContextProps = {
		isInRoom, 
		setInRoom,
		gameWidth,
		setGameWidth,
		gameHeight,
		setGameHeight,
		playerName,
		setPlayerName,
		playerSide,
		setPlayerSide, 
		opponentName,
		setOpponentName
	};

	return (
		<GameContext.Provider value={gameContextValue}>
			{!isInRoom && <JoinRoom />}
			{isInRoom && <GameArea />}
		</GameContext.Provider>
	)
}


export default Game;