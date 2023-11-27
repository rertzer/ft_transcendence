import { useContext, useEffect } from 'react';
import gameContext from '../../../../context/gameContext';
import { gameSocket } from '../../services/gameSocketService';
import { GameStatus } from '../../../../context/gameContext';
import { PageContext } from '../../../../context/PageContext';

export function WaitingRoom(props:any) {
	const {modeGame, setGameStatus, setRoomId} = useContext(gameContext);
	const context = useContext(PageContext);
	if (!context) {
	  throw new Error('useContext must be used within a MyProvider');
	}
	const { scroll, toolbar, zoom } = context;

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
		<div onClick={() => console.log(modeGame)} style={{position: 'fixed', top: toolbar ? '89px' : '166px', left: 'calc(1% + 31px)', color: '#000000'} }>
			{ modeGame === 'BASIC' && 
			<div
			key={`basic waiting room`}
			style={{
			  position: 'absolute',
			  top: (scroll.scrollX > 1) ? '-100px' : `${(20 + (zoom - 100) / 8) * (1 - scroll.scrollX)}px`,
			  left: `${0 + (80 + (zoom - 100) / 2) * (1 - scroll.scrollY)}px`,
			  width: `${(80 + (zoom - 100) / 2) * 5}px`,
			  height: `${(20 + (zoom - 100) / 8) * 1}px`,
			  fontSize: `${12 + ((zoom - 100) / 16)}px`,
			  backgroundColor: 'white',
			  textAlign: 'center',
			  border: '1px solid black',
			}}>
			You are in the waiting room to join a <b>basic</b> game! 
		  </div>}
			{ modeGame === 'ADVANCED' && <div
			key={`basic waiting room`}
			style={{
			  position: 'absolute',
			  top: (scroll.scrollX > 1) ? '-100px' : `${(20 + (zoom - 100) / 8) * (1 - scroll.scrollX)}px`,
			  left: `${0 + (80 + (zoom - 100) / 2) * (1 - scroll.scrollY)}px`,
			  width: `${(80 + (zoom - 100) / 2) * 5}px`,
			  height: `${(20 + (zoom - 100) / 8) * 1}px`,
			  fontSize: `${12 + ((zoom - 100) / 16)}px`,
			  backgroundColor: 'white',
			  textAlign: 'center',
			  border: '1px solid black',
			}}>
			You are in the waiting room to join an <b>advanced</b> game! 
		  </div>}
		</div>
	)
}
