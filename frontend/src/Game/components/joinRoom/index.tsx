import React, { useState } from 'react';

interface IJoinRoomProps {

};

export function JoinRoom(props:IJoinRoomProps) {
 const [roomName, setRoomName] = useState('');
 const handleRoomNameChange = (event:React.ChangeEvent<any>) => {
	const value = event.target.value;
	setRoomName(value);
 };

	return (
		<form>
			<h4>Enter room name to join the game</h4>
			<input placeholder='Room ID' value={roomName} onChange={handleRoomNameChange}/>
			<button id="gameIDbutton">Join</button>
		</form>
	)
};