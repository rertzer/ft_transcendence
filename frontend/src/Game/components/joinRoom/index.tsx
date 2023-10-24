import React, { useContext, useState } from 'react';
import gameContext from '../../gameContext';

interface IJoinRoomProps {
};

export function JoinRoom(props:IJoinRoomProps) {
	const {setRoomName} = useContext(gameContext);
	const [TmpRoomName, setTmpRoomName] = useState('');
	

	const handleRoomNameChange = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setTmpRoomName(value);
	};

	const joinRoom = (e: React.FormEvent) => {
		e.preventDefault();
		if (!TmpRoomName || TmpRoomName.trim() === "" ) return;
		setRoomName(TmpRoomName);
	};

	return (
		<form onSubmit={joinRoom}>
			<h4>Enter room name to join the game</h4>
			<input 
				id="roomID"
				placeholder='Room ID' 
				value={TmpRoomName} 
				onChange={handleRoomNameChange}/>
			<button type="submit"> Join'</button>
		</form>
	)
};