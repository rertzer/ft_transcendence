import React from 'react';
import "./Chat.scss";
import ProfileIcon from '@mui/icons-material/AccountBoxOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import Messages from "./Messages";
import MessageInput from "./MessageInput";

const Chat = () => {

    return (
        <div className='chat'>
            <div className='chatInfo'>
                <span>mbocquel</span>
                <div className="chatIcons">
                    <div>
                        <ProfileIcon />
                    </div>
                    <div>
                        <BlockIcon />
                    </div>
                </div>
            </div>
            <Messages />
            <MessageInput />
        </div>
    )
}

export default Chat;