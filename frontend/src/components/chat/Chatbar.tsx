import React from 'react';
import "./Chatbar.scss"
//import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const Chatbar = () => {
    return (
        <div className='chatbar'>
            <span className='chatlogo'>Pong Chat</span>
        </div>
    )
}

export default Chatbar;