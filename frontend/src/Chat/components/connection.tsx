import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../contexts/ChatContext";
import ChatContext from "../contexts/ChatContext";

type UserConnection = {
	id: string;
	username: string;
};

export const Connection = () => {

	const {username, setUsername, setIsInChat,isConnected, setIsConnected} = useContext(ChatContext)
	const socket = useContext(WebsocketContext);

	const sendUserConnection = () => {
		socket.emit('onUserConnection', username);
		setUsername(username);
	}

	useEffect(() => {
		socket.on('onUserConnection', (UserConnection: UserConnection) => {
			console.log('userConnection event received!');
			//console.log(UserConnection.username);
			//console.log(UserConnection.id);
			if (UserConnection.id === '-1')
			{
				console.log("wrong id")
				setUsername('');

			}
			else{
				console.log("username before set", username	)
				setUsername(UserConnection.username);
				setIsConnected(true);
			}
		  },);
		  return () => {
			console.log('Unregistering Events...');
			socket.off('userConnection');
	};
	}, []);
	return (
		<div>
			<div>
				<p>Enter your username</p>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<button onClick={sendUserConnection }>Send</button>
				{!isConnected && (
					<div>
						<p>Not connected</p>
					</div>
				)}
			</div>
		</div>
	)
}
