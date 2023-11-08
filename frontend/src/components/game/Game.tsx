import React, {useEffect, useState, useContext} from 'react';
import { JoinRoom } from './components/joinRoom';
import GameContext, { IGameContextProps } from '../../context/gameContext';
import GameArea from './components/gameArea';
import ConnectionContext from '../../context/authContext'

function Game() {
	const [roomName, setRoomName] = useState('');
	const [playerName, setPlayerName] = useState('');
	const [gameWidth, setGameWidth] = useState(0);
	const [gameHeight, setGameHeight] = useState(0);
	const [nbBalls, setNbBalls] = useState(1);
	const [modeGame, setModeGame] = useState('');

	const {username} = useContext(ConnectionContext);

	useEffect(() => {
		setPlayerName(username);
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
		nbBalls,
		setNbBalls, 
		modeGame,
		setModeGame
	};

	return (
		<GameContext.Provider value={gameContextValue}>
			{playerName!== '' && modeGame === '' && <JoinRoom />}
			{playerName!== '' && modeGame !== '' && <GameArea />}
		</GameContext.Provider>
	)
}


export default Game;