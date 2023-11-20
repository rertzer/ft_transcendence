import "./Chat.scss";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import ChatContext from "../../context/chatContext";
import ConversationBar from "./ConversationBar";
import { useContext, useState } from "react";


const Chat = () => {

    const {activeChannel} = useContext(ChatContext);
    let isOwner = false;
    const [isAdmin, setIsAdmin] = useState(false);
    let isDM = false;
    if (activeChannel.status === "owner") {
        isOwner = true; }
    if (activeChannel.status === "admin") {
        setIsAdmin(true); }
    if (activeChannel.type === "DM") {
        isDM = true; }

    return (
        <div className='chat'>
            <ConversationBar isOwner={isOwner} isAdmin={isAdmin}/>
            <Messages chatId={activeChannel.id} isOwner={isOwner} isAdmin={isAdmin} setIsAdmin={setIsAdmin} isDM={isDM}/>
            <MessageInput chatId={activeChannel.id}/>
        </div>
    )
}

export default Chat;
