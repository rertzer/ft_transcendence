import "./Chat.scss";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { allChatOfUser } from "./ChatComponent";
import ConversationBar from "./ConversationBar";

const Chat = (props: {toDisplay: allChatOfUser, setActiveChat: Function}) => {

    let isOwner = true;
    let isAdmin = true;
    let isMuted = false; //3 variables a mettre dans des useState ?

    // if (props.toDisplay.ownerUid === currentUser.uid) {
    //     isOwner = true; }
    // if (props.toDisplay.adminUids.indexOf(currentUser.uid) !== -1) {
    //     isAdmin = true; }

    return (
        <div className='chat'>
            <ConversationBar toDisplay={props.toDisplay} setActiveChat={props.setActiveChat} isOwner={isOwner}/>
            <Messages chatId={props.toDisplay.id} isOwner={isOwner} isAdmin={isAdmin} setActiveChat={props.setActiveChat}/>
            <MessageInput chatId={props.toDisplay.id}/>
        </div>
    )
}

export default Chat;
