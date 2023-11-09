import "./Chat.scss";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { allChatOfUser } from "./ChatComponent";
import  ConnectionContext from "../../context/authContext"
import ConversationBar from "./ConversationBar";
import { useContext } from "react";


const Chat = (props: {toDisplay: allChatOfUser, setActiveChat: Function}) => {

    let isOwner = false;
    let isAdmin = false;
    if (props.toDisplay.status === "owner") {
        isOwner = true; }
    if (props.toDisplay.status === "admin") {
        isAdmin = true; }

    return (
        <div className='chat'>
            <ConversationBar toDisplay={props.toDisplay} setActiveChat={props.setActiveChat} isOwner={isOwner} isAdmin={isAdmin}/>
            <Messages chatId={props.toDisplay.id} isOwner={isOwner} isAdmin={isAdmin} setActiveChat={props.setActiveChat}/>
            <MessageInput chatId={props.toDisplay.id}/>
        </div>
    )
}

export default Chat;
