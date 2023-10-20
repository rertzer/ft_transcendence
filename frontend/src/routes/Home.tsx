import "./Home.scss";
import Sidebar from "../components/chat/Sidebar";
import Chat from "../components/chat/Chat";
import ChatComponent from "../components/chat/ChatComponent";
import ChatContext from "../Chat/contexts/ChatContext";
import { useContext } from "react";
import GameWindow from "../components/GameWindow";

function Home() {

    return (
        <div className="home">
            <div className="container">
                <GameWindow />
            </div>
        </div>
    );
}

export default Home;