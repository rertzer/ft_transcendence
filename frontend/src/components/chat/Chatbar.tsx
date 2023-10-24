import React from 'react';
import "./Chatbar.scss"
//import { AuthContext } from "../../context/authContext";
import { Tooltip } from '@mui/material';
import { AddChat } from './AddChat';
import MenuIcon from '@mui/icons-material/Menu';

const Chatbar = () => {
    return (
        <div className='chatbar'>
            <span className='chatlogo'>Pong Chat</span>
            <div className='icons'>
                <Tooltip title="List available channels" arrow>
                    <MenuIcon />
                </Tooltip>
                <Tooltip title="Create new channels" arrow>
                    <AddChat />
                </Tooltip>
            </div>
        </div>
    )
}

export default Chatbar;
