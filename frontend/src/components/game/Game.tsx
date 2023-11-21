import React, {useEffect, useState, useContext} from 'react';
import { JoinRoom } from './components/joinRoom';
import GameContext, { IGameContextProps } from '../../context/gameContext';
import GameArea from './components/gameArea';
import { useLogin } from '../user/auth';
import { GameStatus } from '../../context/gameContext';
import { WaitingRoom } from './components/waitingRoom';
import { gameSocket } from './services/gameSocketService';

function Game() {
	/* const [roomId, setRoomId] = useState(0);
	const [playerName, setPlayerName] = useState('');
	const [gameWidth, setGameWidth] = useState(0);
	const [gameHeight, setGameHeight] = useState(0);
	const [modeGame, setModeGame] = useState('');
	const [gameStatus, setGameStatus] = useState<GameStatus>('NOT_IN_GAME');
	const auth = useLogin();

	useEffect(() => {
		setPlayerName(auth.user.login);
		gameSocket.connect();
		return (()=> {
			gameSocket.disconnect();
		})
	}, []);

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
	}; */
	
	const {gameStatus, playerName} = useContext(GameContext);
	useEffect(() => {
		console.log(playerName)
	}, []);

	return (
		//<GameContext.Provider value={gameContextValue}>
		<>
			{ gameStatus === 'NOT_IN_GAME' && <JoinRoom />}
			{ gameStatus === 'IN_WAITING_ROOM'&& <WaitingRoom /> }
			{ gameStatus !== 'IN_WAITING_ROOM' && gameStatus !== 'NOT_IN_GAME' && <GameArea />}
		</>
	)
}


export default Game;