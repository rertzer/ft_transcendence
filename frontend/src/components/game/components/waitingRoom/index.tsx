import React, { useContext, useEffect, useState } from 'react';
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
	}, []);

	return (
		<>
			{ modeGame === 'BASIC' && <div>You are in the waiting room to join a basic game !  </div>}
			{ modeGame === 'ADVANCED' && <div>You are in the waiting room to join an advanced game !  </div>}
		</>
	)
}
