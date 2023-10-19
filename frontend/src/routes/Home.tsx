import "./Home.scss";
import Game from "../components/Game"
import Sidebar from "../components/chat/Sidebar";
import Chat from "../components/chat/Chat";
import ChatComponent from "../components/chat/ChatComponent";
import ChatContext from "../Chat/contexts/ChatContext";
import { useContext } from "react";

function Home() {

    return (
        <div className="home">
            <div className="container">
                Pong.
            </div>
        </div>
    );
}

export default Home;