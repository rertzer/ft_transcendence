import React from 'react';
import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'
import { useState } from 'react';

const ChatComponent = () => {

    const [activeChat, setActiveChat] = useState(-1)

    return (
        <div className="chatcomponent">
            <div className='container'>
                <Sidebar activeChat={}/>
                <Chat />
            </div>
        </div>
    )
}

export default ChatComponent;