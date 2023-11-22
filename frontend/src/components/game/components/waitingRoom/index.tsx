import { useContext, useEffect } from 'react';
import gameContext from '../../../../context/gameContext';
import { gameSocket } from '../../services/gameSocketService';
import { GameStatus } from '../../../../context/gameContext';

export function WaitingRoom(props:any) {
	const {modeGame, setGameStatus, setRoomId} = useContext(gameContext);

	useEffect(()=> {
		function processRoomJoined(data:{roomId:number, gameStatus: GameStatus}) {
			setGameStatus(data.gameStatus);
			setRoomId(data.roomId);
			console.log('I joined room number ' + data.roomId.toString() + ' to play');
		}

		function processErrorJoin(data:{roomId:number, errorMsg:string}) {
			window.alert('Error for room ' + data.roomId.toString() + ': ' + data.errorMsg);
		}
		
		gameSocket.on('room_joined', processRoomJoined);
		gameSocket.on('error_join', processErrorJoin);

		return () => {
			gameSocket.off('room_joined', processRoomJoined);
			gameSocket.off('error_join', processErrorJoin);
		}
	}, [setGameStatus, setRoomId]);

	return (
		<div onClick={() => console.log(modeGame)} style={{position: 'relative', color: '#000000', backgroundColor: '#FFFFFF', top: '140px', left: '134px', height:'315px', width: '368px'} }>
			{ modeGame === 'BASIC' && <div>You are in the waiting room to join a basic game !  </div>}
			{ modeGame === 'ADVANCED' && <div>You are in the waiting room to join an advanced game !  </div>}
		</div>
	)
}
