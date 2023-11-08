import React, { useContext, useState } from 'react';
import gameContext from '../../../../context/gameContext';

interface IJoinRoomProps {
};

export function JoinRoom(props:IJoinRoomProps) {
	const {setRoomName, setNbBalls, setModeGame, modeGame} = useContext(gameContext);
	const [TmpModeGame, setTmpModeGame] = useState('');
	const [TmpRoomName, setTmpRoomName] = useState('');
	const [TmpNbBall, setTmpNbBall] = useState(1);
	
	const handleSelectTypeGame = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setTmpModeGame(value);
		console.log(TmpModeGame);
	};

	const joinRoom = (e: React.FormEvent) => {
		e.preventDefault();
		if (!TmpModeGame || TmpModeGame.trim() === "" ) return;
		setModeGame(TmpModeGame);
	};

	return (
		<form onSubmit={joinRoom}>
			<h4>What type of Pong game do you want to play ?</h4>
  			<label>Basic Game <input type="radio" name="typegame" value="basic" onClick={handleSelectTypeGame}/></label><br/>
			<label>Advanced <input type="radio" name="typegame" value="advanced" onClick={handleSelectTypeGame}/></label><br/>
			<button type="submit"> Join !</button>
		</form>
	)
};

/**
 * <form onSubmit={joinRoom}>
			<h4>What type of Pong game do you want to play ?</h4>
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
 */