import "./Navbar.css";
import {Link} from "react-router-dom";
import { NavbarItems } from "./NavbarItems";
import {useState} from 'react';

function Navbar() {

    const [clicked, setClicked] = useState(false);

    function handleClick() {
        setClicked(!clicked);
    }

    return (
        <nav className="NavbarItems">
            <Link className="navbar-logo" to="/">
                <h1><i className="navbar-logo"></i>Pong</h1>
            </Link>

            <div className="menu-icons" onClick={handleClick}>
                <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
            </div>

            <ul className={clicked ? "nav-menu active" : "nav-menu"}>
                {NavbarItems.map((item, index) => {
                    return (<li key={index}>
                        <Link className={item.cName} to={item.url}>
                            <i className={item.icon}></i>{item.title}
                        </Link>
                    </li>);
                })}
            </ul>
        </nav>
    );
}

export default Navbar;