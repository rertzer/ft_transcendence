import React, { useContext, useState } from 'react';
import socketService from '../../services/socketService';
import gameService from '../../services/gameService';
import gameContext from '../../gameContext';

interface IJoinRoomProps {

};

export function JoinRoom(props:IJoinRoomProps) {
	const [roomName, setRoomName] = useState('');
	const [isJoining, setJoining] = useState(false);

	const {setInRoom, playerName, setPlayerName, setOpponentName, setPlayerSide } = useContext(gameContext);
	const handleRoomNameChange = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setRoomName(value);
	};

	const handlePlayerNameChange = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setPlayerName(value);
	};

	const joinRoom = async (e: React.FormEvent) => {
		e.preventDefault();
		const socket = socketService.socket;
		if (!roomName || roomName.trim() === "" || !socket || !playerName || playerName.trim() === "") return;
		setJoining(true);
		const joined = await gameService.joinGameRomm(socket, roomName, playerName).catch(
			(error) => {alert(error);
			});
		if (joined) {
			setInRoom(true);
			setOpponentName(gameService.getOpponentName());
			setPlayerSide(gameService.getPlayerSide());
		}
		setJoining(false);
	};

	return (
		<form onSubmit={joinRoom}>
			<h4>Enter room name to join the game</h4>
			<input 
				placeholder='Room ID' 
				value={roomName} 
				onChange={handleRoomNameChange}/>
			<input 
				placeholder='PlayerName' 
				value={playerName} 
				onChange={handlePlayerNameChange}/>
			<button type="submit" disabled={isJoining}>{isJoining ? 'Joining...' : 'Join'}</button>
		</form>
	)
};