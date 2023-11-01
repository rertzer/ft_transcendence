import "./Home.scss";
import { useContext } from "react";
import GameWindow from "../components/GameWindow";
import { WebsocketContext } from "../context/chatContext";
import ConnectionContext from '../context/authContext'


function Home() {

    const socket = useContext(WebsocketContext);
    const {username} = useContext(ConnectionContext);
	socket.emit("newChatConnection", username);
	
    return (
        <div className="home">
            <div className="container">
                <GameWindow />
            </div>
        </div>
    );
}

export default Home;
