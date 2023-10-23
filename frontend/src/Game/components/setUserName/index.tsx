import React, { useContext, useState } from 'react';
import gameContext from '../../gameContext';

interface IConnectGameProps {

};

export function SetUserName(props:IConnectGameProps) {
	const {playerName, setPlayerName } = useContext(gameContext);
	const [tempName, setTempName] = useState('');

	const handlePlayerNameChange = (event:React.ChangeEvent<any>) => {
		const value = event.target.value;
		setTempName(value);
	};

	const submitUserName = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!tempName || tempName.trim() === "") {
			return;
		}
		setPlayerName(tempName);
	};

	return (
		<form onSubmit={submitUserName}>
			<h4>Enter userName</h4>
			<input 
				id = 'PlayerName' 
				placeholder='PlayerName' 
				value={tempName} 
				onChange={handlePlayerNameChange}/>
			<button type="submit" >Ok</button>
		</form>
	)
};