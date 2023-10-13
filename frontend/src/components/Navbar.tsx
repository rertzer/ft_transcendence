import "./Navbar.scss";
import {Link} from "react-router-dom";
import SearchIcon from '@mui/icons-material/SearchOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';

function Navbar() {

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
                <DarkModeIcon />
                <div className="user">
                    <img src="https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg"/>
                    <span>tgrasset</span>
                </div>
                <LogoutIcon />
            </div>
        </div>
    );
}

export default Navbar;