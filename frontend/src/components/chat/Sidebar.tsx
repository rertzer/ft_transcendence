import React from 'react';
import "./Sidebar.scss"
import Chatbar from './Chatbar';
import Search from './Search';
import Chats from "./Chats";

const Sidebar = (props: {activeChat: {id: number, name: string}, setActiveChat: Function}) => {

    return (
        <div className='sidebar'>
            <Chatbar />
            <Search />
            <Chats activeChat={props.activeChat} setActiveChat={props.setActiveChat}/>
        </div>
    )
}

export default Sidebar;
