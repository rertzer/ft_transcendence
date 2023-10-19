import React from 'react';
import "./Chatbar.scss"
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";


const Chatbar = () => {

    const {currentUser} = useContext(AuthContext);

    return (
        <div className='chatbar'>
            <span className='chatlogo'>Pong Chat</span>
            <div className="chatuser">
                <img src={currentUser.profilePic} alt="your profile picture" />
                <span>{currentUser.name}</span>
            </div>
        </div>
    )
}

export default Chatbar;