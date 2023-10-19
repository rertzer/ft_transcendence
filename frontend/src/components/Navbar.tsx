import "./Navbar.scss";
import {Link} from "react-router-dom";
import SearchIcon from '@mui/icons-material/SearchOutlined';
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import ForumIcon from '@mui/icons-material/ForumOutlined';

function Navbar(props: any) {

    const {currentUser} = useContext(AuthContext);

    function handleClickHamburger() {
        if (props.showRightBar === "none" || props.showRightBar === "chat") {
            props.setShowRightBar("notifications");
        } else {
            props.setShowRightBar("none");
        }
    }

    function handleClickChat() {
        if (props.showRightBar === "none" || props.showRightBar === "notifications") {
            props.setShowRightBar("chat");
        } else {
            props.setShowRightBar("none");
        }
    }

    return (
        <div className="navbar">
            <div className="left">
                <Link to="/" style={{textDecoration:"none"}}>
                <span>Pong.</span>
                </Link>
                <div className="search">
                    <SearchIcon />
                    <input type="text" placeholder="Recherche de profils, parties, canaux..." />
                </div>
            </div>
            <div className="right">
                <div className="user">
                    <img src={currentUser.profilePic}/>
                    <span>{currentUser.name}</span>
                </div>
                <ForumIcon style={{cursor:"pointer"}} onClick={handleClickChat}/>
                <MenuIcon style={{cursor:"pointer"}} onClick={handleClickHamburger}/>
                <LogoutIcon style={{cursor:"pointer"}}/>
            </div>
        </div>
    );
}

export default Navbar;