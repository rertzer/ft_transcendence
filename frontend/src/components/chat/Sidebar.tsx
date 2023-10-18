import React from 'react';
import "./Sidebar.scss"
import Chatbar from './Chatbar';
import Search from './Search';
import Chats from "./Chats";

const Sidebar = () => {

    return (
        <div className='sidebar'>
            <Chatbar />
            <Search />
            <Chats />
        </div>
    )
}

export default Sidebar;