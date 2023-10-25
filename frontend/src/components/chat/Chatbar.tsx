import "./Chatbar.scss"
import { AddChat } from './AddChat';
import { ListChannels } from './ListChannels';
import { allChatOfUser } from "./ChatComponent"
import { useState } from 'react';

const Chatbar = (props: {chatsOfUser: allChatOfUser[]}) => {

    const [showSubMenu, setShowSubMenu] = useState("none");

    return (
        <div className='chatbar'>
            <span className='chatlogo'>Pong Chat</span>
            <div className='icons'>
                <ListChannels chatsOfUser={props.chatsOfUser} showSubMenu={showSubMenu} setShowSubMenu={setShowSubMenu}/>
                <AddChat chatsOfUser={props.chatsOfUser} showSubMenu={showSubMenu} setShowSubMenu={setShowSubMenu}/>
            </div>
        </div>
    )
}

export default Chatbar;
