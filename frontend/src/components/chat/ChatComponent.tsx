import React from 'react';
import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'
import { useState } from 'react';

type Active = {
	id: string;
    name: string
}

const ChatComponent = () => {

    const [activeChat, setActiveChat] = useState<Active>({id: "-1", name: "Chat window"})

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