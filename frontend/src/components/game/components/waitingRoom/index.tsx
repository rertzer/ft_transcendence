import { useContext, useEffect } from 'react';
import gameContext from '../../../../context/gameContext';
import { gameSocket } from '../../services/gameSocketService';
import { GameStatus } from '../../../../context/gameContext';
import { PageContext } from '../../../../context/PageContext';

export function WaitingRoom(props:any) {
	const {setGameStatus, setRoomId} = useContext(gameContext);
	const context = useContext(PageContext);
	if (!context) { throw new Error('useContext must be used within a MyProvider'); }
	const { scroll, toolbar, zoom } = context;

	useEffect(()=> {
		function processRoomJoined(data:{roomId:number, gameStatus: GameStatus}) {
			setGameStatus(data.gameStatus);
			setRoomId(data.roomId);
			console.log('I joined room number ' + data.roomId.toString() + ' to play');
		}

		function processErrorJoin(data:{roomId:number, errorMsg:string}) {
			if (data.errorMsg !== 'The room does not exist') {
				window.alert('Error for room ' + data.roomId.toString() + ': ' + data.errorMsg);
			}
			else {
				setGameStatus("OPPONENT_LEFT_ROOM");
			}
		}
		
		gameSocket.on('room_joined', processRoomJoined);
		gameSocket.on('error_join', processErrorJoin);

		return () => {
			gameSocket.off('room_joined', processRoomJoined);
			gameSocket.off('error_join', processErrorJoin);
		}
	}, [setGameStatus, setRoomId]);

	return (
		<div></div>
	)
}
