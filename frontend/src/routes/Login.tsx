import "./Login.scss"
import {Link, Navigate } from "react-router-dom";
//import { AuthContext } from "../context/authContext";
import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../context/chatContext";
import  ConnectionContext from "../context/authContext"

type UserConnection = {
	id: string;
	username: string;
};

function Login() {

    //const {login} = useContext(AuthContext);
	const {username, setUsername} = useContext(ConnectionContext)
	const [userOk, setuserOk] = useState(false);
    // const handleLogin = () => {
    //     login();
    // }
	const socket = useContext(WebsocketContext);

	useEffect(() => {
		socket.connect();
		console.log("fuck");
	  }, []);

	const sendUserConnection = () => {

		socket.emit('onUserConnection', username);
		setUsername(username);
	}

	useEffect(() => {
		socket.on('onUserConnection', (UserConnection: UserConnection) => {
			if (UserConnection.id === '-1')
			{

				setUsername('');
				setuserOk(false)

			}
			else{
				setUsername(UserConnection.username);
				setuserOk(true)
			}
		  },);
		  return () => {

			socket.off('onUserConnection');
	};
	}, []);

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Pong.</h1>
                    <p>
                        Salut, ici on joue a pong.
                        Tu connais pas? C'est un jeu de tennis en gros.
                    </p>
                    <span>T'as pas de compte ? Bah vas-y clique.</span>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>

                </div>
                <div className="right">
                    <h1>Log in</h1>
                    <form>
                        <input type="text" placeholder="Login" />
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <input type="password" placeholder="Password" />
                    </form>
                        <button onClick={sendUserConnection}>Log in</button>
					{userOk && (
						<Navigate to='/'></Navigate>
					)}
                </div>
            </div>
        </div>
    )
}

export default Login;
