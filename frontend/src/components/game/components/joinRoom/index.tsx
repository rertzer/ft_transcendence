import React, { useContext, useEffect, useState } from 'react';
import gameContext from '../../../../context/gameContext';
import { gameSocket } from '../../services/gameSocketService';
import { ConstructionOutlined } from '@mui/icons-material';

interface IJoinRoomProps {
};

export function JoinRoom(props:IJoinRoomProps) {
	const {setRoomId, setModeGame, setGameStatus, playerName} = useContext(gameContext);
	const [TmpModeGameWaiting, setTmpModeGameWaiting] = useState('');
	const [TmpModeGameNewRoom, setTmpModeGameNewRoom] = useState('');
	const [TmpRoomName, setTmpRoomName] = useState('');
	const [RecievedRoomID, setRecievedRoomID] = useState(0);
	
	const handleSelectTypeGameWaiting = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setTmpModeGameWaiting(value);
	};

	const handleSelectTypeGameNewRoom = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setTmpModeGameNewRoom(value);
	};

	const handleRoomNameChange = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setTmpRoomName(value);
	};

	const joinWaitingRoom = (e: React.FormEvent) => {
		e.preventDefault();
		if (!TmpModeGameWaiting || TmpModeGameWaiting.trim() === "" ) return;
		setModeGame(TmpModeGameWaiting);
		gameSocket.emit('match_me', {playerName:playerName, typeGame:TmpModeGameWaiting})
	};

	const joinSpecificRoom = (e: React.FormEvent) => {
		e.preventDefault();
		if (!TmpRoomName || TmpRoomName.trim() === "" ) return;
		gameSocket.emit("join_room", {roomId:TmpRoomName, playerName});
	};

	const askNewRoomNumber = (e: React.FormEvent) => {
		e.preventDefault();
		if (!TmpModeGameNewRoom || TmpModeGameNewRoom.trim() === "" ) return;
		gameSocket.emit('give_me_a_room', {typeGame: TmpModeGameNewRoom});
	};

	useEffect(()=>{

		function processNewEmptyRoom(data:{roomId:number}) {
			setRecievedRoomID(data.roomId);
			console.log(data.roomId)
		}
		function processWaitingRoomJoined() {
			console.log('coucou la waiting room')
			setGameStatus('IN_WAITING_ROOM');
		}

		function processRoomJoined(data:{roomId:number}) {
			setGameStatus('WAITING_FOR_PLAYER');
			setRoomId(data.roomId);
			window.alert('I joined ' + data.roomId.toString() + ' to play');
		}

		function processErrorJoin(data:{roomId:number, errorMsg:string}) {
			window.alert('Error for room ' + data.roomId.toString() + ': ' + data.errorMsg);
		}
		
		gameSocket.on('new_empty_room', processNewEmptyRoom);
		gameSocket.on('waiting_room_joined', processWaitingRoomJoined);
		gameSocket.on('room_joined', processRoomJoined);
		gameSocket.on('error_join', processErrorJoin);
	

		return () => {
			gameSocket.off('new_empty_room', processNewEmptyRoom);
			gameSocket.off('waiting_room_joined', processWaitingRoomJoined);
			gameSocket.off('room_joined', processRoomJoined);
			gameSocket.off('error_join', processErrorJoin);
		}

	}, [RecievedRoomID]);

	return (
		<>
			<h4>Join a waiting Room : </h4>
			<form onSubmit={joinWaitingRoom}>
	 			<label>Basic Game <input type="radio" name="typegame_waiting" value="BASIC" onClick={handleSelectTypeGameWaiting}/></label><br/>
				<label>Advanced <input type="radio" name="typegame_waiting" value="ADVANCED" onClick={handleSelectTypeGameWaiting}/></label><br/>
				<button type="submit"> Join the waiting room !</button><br/>
			</form>
			<br/>
			<h4>Join a specific room </h4>
			<form onSubmit={joinSpecificRoom}>
	 			<label>Id Room <input id="roomID" placeholder='Room ID'	value={TmpRoomName} onChange={handleRoomNameChange}/></label><br/>
				<button type="submit"> Join the room !</button><br/>
			</form>
			<br/>
			<h4>Ask for a new Room Number</h4>
			<form onSubmit={askNewRoomNumber}>
				<label>Basic Game <input type="radio" name="typegame_new_room" value="BASIC" onClick={handleSelectTypeGameNewRoom}/></label><br/>
				<label>Advanced <input type="radio" name="typegame_new_room" value="ADVANCED" onClick={handleSelectTypeGameNewRoom}/></label><br/>
				<button type="submit"> Ask for a Room !</button><br/>
			</form>
			{RecievedRoomID > 0 &&  <strong><br/>You got the room number {RecievedRoomID}</strong>}
		</>
	)
};
