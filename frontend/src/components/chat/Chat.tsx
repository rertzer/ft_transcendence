import "./Chat.scss";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import ChatContext from "../../context/chatContext";
import ConversationBar from "./ConversationBar";
import { useContext, useEffect, useState } from "react";


const Chat = () => {

    const {activeChannel} = useContext(ChatContext);
    let isOwner = false;
    let isDM = false;
    const [isAdmin, setIsAdmin] = useState(false);
    if (activeChannel.status === "owner") {
        isOwner = true;   
    } else if (activeChannel.type === "DM") {
        isDM = true;
    }
    useEffect(() => {
        if (activeChannel.status === "admin")
            setIsAdmin(true);
        else
            setIsAdmin(false);
    }, [activeChannel]);

    return (
        <div className='chat'>
            <ConversationBar isOwner={isOwner} isAdmin={isAdmin}/>
            <Messages chatId={activeChannel.id} isOwner={isOwner} isAdmin={isAdmin} setIsAdmin={setIsAdmin} isDM={isDM}/>
            <MessageInput chatId={activeChannel.id}/>
        </div>
    )
}

export default Chat;
