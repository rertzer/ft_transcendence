import "./Chat.scss";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import ChatContext from "../../context/chatContext";
import ConversationBar from "./ConversationBar";
import { useContext, useEffect, useState } from "react";


const Chat = () => {

    const {activeChannel} = useContext(ChatContext);
    let isDM = false;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false); 
    if (activeChannel.type === "DM") {
        isDM = true;
    }
    useEffect(() => {
        if (activeChannel.status === "admin")
            setIsAdmin(true);
        else
            setIsAdmin(false);
        if (activeChannel.status === "owner")
            setIsOwner(true);
        else
            setIsOwner(false);
    }, [activeChannel]);

    return (
        <div className='chat'>
            <ConversationBar isOwner={isOwner} isAdmin={isAdmin}/>
            <Messages chatId={activeChannel.id} isOwner={isOwner} setIsOwner={setIsOwner} isAdmin={isAdmin} setIsAdmin={setIsAdmin} isDM={isDM}/>
            <MessageInput chatId={activeChannel.id}/>
        </div>
    )
}

export default Chat;
