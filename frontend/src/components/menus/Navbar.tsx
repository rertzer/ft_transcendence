import "./Navbar.scss";
import {Link} from "react-router-dom";
import SearchIcon from '@mui/icons-material/SearchOutlined';
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import { useContext } from "react";
import ForumIcon from '@mui/icons-material/ForumOutlined';
import LeaderboardIcon from '@mui/icons-material/LeaderboardOutlined';
import FriendsIcon from '@mui/icons-material/Diversity1Outlined';
import { Tooltip } from "@mui/material";
import  ConnectionContext from "../../context/authContext"

function Navbar(props: {RightBar: string, setRightBar: Function}) {

    const {username} = useContext(ConnectionContext);

    function handleClickFriends() {
        if (props.RightBar !== "friends") {
            props.setRightBar("friends");
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
                <Link to="/profile/1" style={{textDecoration:"none", color: "#3e3c61"}}>
                    <div className="user">
                        <img src={""}/>
                        <span>{username}</span>
                    </div>
                </Link>
                <Tooltip title="Chat" arrow>
                    {props.RightBar === "chat" ?
                    <ForumIcon style={{cursor:"pointer", color:"#5d5b8d"}} onClick={handleClickChat}/> :
                    <ForumIcon style={{cursor:"pointer"}} onClick={handleClickChat}/>
                }
                </Tooltip>
                <Tooltip title="Friends" arrow>
                    {props.RightBar === "friends" ?
                    <FriendsIcon style={{cursor:"pointer", color:"#5d5b8d"}} onClick={handleClickFriends}/> :
                    <FriendsIcon style={{cursor:"pointer"}} onClick={handleClickFriends}/> }
                </Tooltip>
                <Tooltip title="Leaderboards" arrow>
                    {props.RightBar === "leaderboards" ?
                    <LeaderboardIcon style={{cursor:"pointer", color:"#5d5b8d"}} onClick={handleClickLeaderboards}/> :
                    <LeaderboardIcon style={{cursor:"pointer"}} onClick={handleClickLeaderboards}/>}
                </Tooltip>
                <Tooltip title="Log out" arrow>
                    <LogoutIcon style={{cursor:"pointer"}}/>
                </Tooltip>
            </div>
        </div>
    );
}

export default Navbar;
