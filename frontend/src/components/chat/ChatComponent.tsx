import React from 'react';
import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'

const ChatComponent = (props: any) => {
    return (
        <div className={props.show === "chat" ? "chatcomponent" : "hidden"}>
            <div className='container'>
                <Sidebar/>
                <Chat />
            </div>
        </div>
    )
}

export default ChatComponent;