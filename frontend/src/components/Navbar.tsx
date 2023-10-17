import "./Navbar.scss";
import {Link} from "react-router-dom";
import SearchIcon from '@mui/icons-material/SearchOutlined';
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Navbar() {

    const {currentUser} = useContext(AuthContext);

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
                <LogoutIcon />
            </div>
        </div>
    );
}

export default Navbar;