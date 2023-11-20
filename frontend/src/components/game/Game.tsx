import React, {useEffect, useState, useContext} from 'react';
import { JoinRoom } from './components/joinRoom';
import GameContext, { IGameContextProps } from '../../context/gameContext';
import GameArea from './components/gameArea';
import { useLogin } from '../user/auth';
import { GameStatus } from '../../context/gameContext';
import { WaitingRoom } from './components/waitingRoom';
import { gameSocket } from './services/gameSocketService';
import { MyContext } from '../../context/PageContext';

function Game() {
	const [roomId, setRoomId] = useState(0);
	const [playerName, setPlayerName] = useState('');
	const [gameWidth, setGameWidth] = useState(0);
	const [gameHeight, setGameHeight] = useState(0);
	const [modeGame, setModeGame] = useState('');
	const [gameStatus, setGameStatus] = useState<GameStatus>('NOT_IN_GAME');
	const auth = useLogin();

	useEffect(() => {
		setPlayerName(auth.user.login);
		gameSocket.connect();
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
	};
	const context = useContext(MyContext);
	if (!context) {
	  throw new Error('useContext must be used within a MyProvider');
	}

	const { resetGame, page, menu, chat, updatePageMenuChatReset, updateReset} = context;
	const [ newResetGame, setNewReset ] = useState(resetGame);

	// useEffect(() => {
	// 	setNewGame(game);
	//   }, [game]);

	// const ft_resetGame = () => {
	// 	if ( resetGame === true)
	// 	{
	// 		gameSocket.emit("i_am_leaving", {roomId});
	// 		setGameStatus('NOT_IN_GAME');
	// 		setRoomId(0);
	// 		setModeGame('');
	// 		updateReset(false);
	// 		console.log("RESETED !!!!!!!!!!!!!!!!!");
	// 	}
	// 	return (1);
	// };

	return (
		<GameContext.Provider value={gameContextValue}>
			{ gameStatus === 'NOT_IN_GAME' /* && (ft_resetGame()) */ && <JoinRoom />}
			{ gameStatus === 'IN_WAITING_ROOM'&& <WaitingRoom /> }
			{ gameStatus !== 'IN_WAITING_ROOM' && gameStatus !== 'NOT_IN_GAME' && <GameArea />}
		</GameContext.Provider>
	)
}


export default Game;