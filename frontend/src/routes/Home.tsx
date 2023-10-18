import "./Home.scss";
import Game from "../components/Game"
import Sidebar from "../components/chat/Sidebar";
import Chat from "../components/chat/Chat";
import ChatComponent from "../components/chat/ChatComponent";

function Home() {

    return (
        <div className="home">
            <div className="container">
                <ChatComponent />
            </div>
        </div>
    );
}

export default Home;