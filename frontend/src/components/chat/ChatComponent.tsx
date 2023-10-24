import React from 'react';
import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'
import { useState } from 'react';

const ChatComponent = () => {

    const [activeChat, setActiveChat] = useState({id: -1, name: "Chat window"})

    return (
        <div className="chatcomponent">
            <div className='container'>
                <Sidebar activeChat={activeChat} setActiveChat={setActiveChat}/>
                <Chat activeChat={activeChat}/>
            </div>
        </div>
    )
}

export default ChatComponent;