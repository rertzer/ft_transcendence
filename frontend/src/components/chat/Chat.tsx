import React from 'react';
import "./Chat.scss";
import ProfileIcon from '@mui/icons-material/AccountBoxOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { Tooltip } from "@mui/material";

const Chat = (props: {activeChat: {id: string, name: string}}) => {

    return (
        <div className='chat'>
            <div className='chatInfo'>
                <span>{props.activeChat.name}</span>
                {props.activeChat.id !== '-1' ? <div className="chatIcons">
                    <div>
                        <Tooltip title="View profile" arrow>
                            <ProfileIcon />
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip title="Block" arrow>
                            <BlockIcon />
                        </Tooltip>
                    </div>
                </div> : <div></div>}
            </div>
            <Messages chatId={props.activeChat.id}/>
            <MessageInput chatId={props.activeChat.id}/>
        </div>
    )
}

export default Chat;
