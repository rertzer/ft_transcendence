import "./Navbar.scss";
import {Link} from "react-router-dom";
import SearchIcon from '@mui/icons-material/SearchOutlined';
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import { useContext } from "react";
//import { AuthContext } from "../../context/authContext";
import ChatroomIcon from '@mui/icons-material/CommentOutlined';
import ForumIcon from '@mui/icons-material/ForumOutlined';
import LeaderboardIcon from '@mui/icons-material/LeaderboardOutlined';
import FriendsIcon from '@mui/icons-material/Diversity1Outlined';
import { Tooltip } from "@mui/material";
import  ConnectionContext from "../../context/authContext"

function Navbar(props: any) {

    const {login} = useContext(ConnectionContext);

    function handleClickFriends() {
        if (props.RightBar !== "friends") {
            props.setRightBar("friends");
        } else {
            props.setRightBar("none");
        }
    }

    function handleClickChannels() {
        if (props.RightBar !== "channels") {
            props.setRightBar("channels");
        } else {
            props.setRightBar("none");
        }
    }  

    function handleClickChat() {
        if (props.RightBar !== "chat") {
            props.setRightBar("chat");
        } else {
            props.setRightBar("none");
        }
    }

    function handleClickLeaderboards() {
        if (props.RightBar !== "leaderboards") {
            props.setRightBar("leaderboards");
        } else {
            props.setRightBar("none");
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
                    <input type="text" placeholder="Rechercher un profil..." />
                </div>
            </div>
            <div className="right">
                <Link to="/profile/1" style={{textDecoration:"none"}}>
                    <div className="user">
                        <img src={""}/>
                        <span>{login}</span>
                    </div>
                </Link>
                <Tooltip title="Chat" arrow>
                    <ForumIcon style={{cursor:"pointer"}} onClick={handleClickChat}/>
                </Tooltip>
                <Tooltip title="Channels" arrow>
                    <ChatroomIcon style={{cursor:"pointer"}} onClick={handleClickChannels}/>
                </Tooltip>
                <Tooltip title="Friends" arrow>
                    <FriendsIcon style={{cursor:"pointer"}} onClick={handleClickFriends}/>
                </Tooltip>
                <Tooltip title="Leaderboards" arrow>
                    <LeaderboardIcon style={{cursor:"pointer"}} onClick={handleClickLeaderboards}/>
                </Tooltip>
                <Tooltip title="Log out" arrow>
                    <LogoutIcon style={{cursor:"pointer"}}/>
                </Tooltip>
            </div>
        </div>
    );
}

export default Navbar;
