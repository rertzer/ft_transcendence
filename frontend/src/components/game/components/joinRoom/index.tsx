import React, { useContext, useState } from 'react';
import gameContext from '../../../../context/gameContext';

interface IJoinRoomProps {
};

export function JoinRoom(props:IJoinRoomProps) {
	const {setRoomName, setNbBalls} = useContext(gameContext);
	const [TmpRoomName, setTmpRoomName] = useState('');
	const [TmpNbBall, setTmpNbBall] = useState(1);
	

	const handleRoomNameChange = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setTmpRoomName(value);
	};

	const handleNbBallsChange = (event:React.ChangeEvent<any>) => {
		const value :number = event.target.value;
		setTmpNbBall(value);
	};

	const joinRoom = (e: React.FormEvent) => {
		e.preventDefault();
		if (!TmpRoomName || TmpRoomName.trim() === "" ) return;
		if (!TmpNbBall || TmpNbBall < 1 || TmpNbBall > 10 ) return;
		setRoomName(TmpRoomName);
		setNbBalls(TmpNbBall);
	};

	return (
		<form onSubmit={joinRoom} style={{position: 'relative', color: '#000000', backgroundColor: '#FFFFFF', top: '140px', left: '134px', height:'115px', width: '368px'}}>
			<h4>Enter room name to join the game</h4>
			Id Room <input 
				id="roomID"
				placeholder='Room ID' 
				value={TmpRoomName} 
				onChange={handleRoomNameChange}/><br/>
			Nb of balls <input 
				id="nbBallsID"
				type="number"
				min="1"
				max="10"
				placeholder='Nb Balls' 
				value={TmpNbBall} 
				onChange={handleNbBallsChange}/><br/>
			<button type="submit"> Join !</button>
		</form>
	)
};