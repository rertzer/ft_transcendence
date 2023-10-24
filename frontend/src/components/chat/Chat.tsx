import React from 'react';
import "./Chat.scss";
import ProfileIcon from '@mui/icons-material/AccountBoxOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { Tooltip } from "@mui/material";
import { StringLiteral } from 'typescript';



const Chat = (props: {activeChat: {id: number, name: string}}) => {

    return (
        <div className='chat'>
            <div className='chatInfo'>
                <span>{props.activeChat.name}</span>
                <div className="chatIcons">
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
                </div>
            </div>
            <Messages chatId={props.activeChat.id}/>
            <MessageInput />
        </div>
    )
}

export default Chat;
