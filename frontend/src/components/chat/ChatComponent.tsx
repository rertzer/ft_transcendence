import React from 'react';
import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'

const ChatComponent = () => {
    return (
        <div className="chatcomponent">
            <div className='container'>
                <Sidebar/>
                <Chat />
            </div>
        </div>
    )
}

export default ChatComponent;