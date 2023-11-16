import React, {useEffect, useState, useContext} from 'react';
import { JoinRoom } from './components/joinRoom';
import GameContext, { IGameContextProps } from '../../context/gameContext';
import GameArea from './components/gameArea';
import ConnectionContext from '../../context/authContext'
import { GameStatus } from '../../context/gameContext';
import { WaitingRoom } from './components/waitingRoom';

function Game() {
	const [roomId, setRoomId] = useState(0);
	const [playerName, setPlayerName] = useState('');
	const [gameWidth, setGameWidth] = useState(0);
	const [gameHeight, setGameHeight] = useState(0);
	const [modeGame, setModeGame] = useState('');
	const [gameStatus, setGameStatus] = useState<GameStatus>('NOT_IN_GAME');
	const {username} = useContext(ConnectionContext);

	useEffect(() => {
		setPlayerName(username);
	}, [username]);

	const gameContextValue :IGameContextProps = {
		roomId,
		setRoomId,
		gameWidth,
		setGameWidth,
		gameHeight,
		setGameHeight,
		playerName,
		setPlayerName, 
		modeGame,
		setModeGame, 
		gameStatus,
		setGameStatus
	};

	return (
		<GameContext.Provider value={gameContextValue}>
			{ gameStatus === 'NOT_IN_GAME' && <JoinRoom />}
			{ gameStatus === 'IN_WAITING_ROOM'&& <WaitingRoom /> }
			{ gameStatus !== 'IN_WAITING_ROOM' && gameStatus !== 'NOT_IN_GAME' && <GameArea />}
			
		</GameContext.Provider>
	)
}


export default Game;