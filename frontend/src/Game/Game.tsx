import React, {useEffect, useState} from 'react';
import { JoinRoom } from './components/joinRoom';
import GameContext, { IGameContextProps } from './gameContext';
import GameArea from './components/gameArea';
import { SetUserName } from './components/setUserName';

function Game() {
	const [roomName, setRoomName] = useState('');
	const [playerName, setPlayerName] = useState('');
	const [playerSide, setPlayerSide] = useState('');
	const [opponentName, setOpponentName] = useState('');
	const [gameWidth, setGameWidth] = useState(0);
	const [gameHeight, setGameHeight] = useState(0);

	useEffect(() => {
		const width = window.innerWidth * 0.9;
		setGameWidth(width);
		setGameHeight((window.innerWidth * 0.9) /2);
	}, []);
	
	const gameContextValue :IGameContextProps = {
		roomName,
		setRoomName,
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
			{playerName === '' && <SetUserName />}
			{playerName!= '' && roomName === '' && <JoinRoom />}
			{playerName!= '' && roomName != '' && <GameArea />}
		</GameContext.Provider>
	)
}


export default Game;