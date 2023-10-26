import "./Chat.scss";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { allChatOfUser } from "./ChatComponent";
import ConversationBar from "./ConversationBar";

const Chat = (props: {toDisplay: allChatOfUser, setActiveChat: Function}) => {

    let isOwner = true;
    let isAdmin = false;

    // if (props.toDisplay.ownerUid === currentUser.uid) {
    //     isOwner = true; }
    // if (props.toDisplay.adminUids.indexOf(currentUser.uid) !== -1) {
    //     isAdmin = true; }

    return (
        <div className='chat'>
            <ConversationBar toDisplay={props.toDisplay} setActiveChat={props.setActiveChat} isOwner={isOwner}/>
            <Messages chatId={props.toDisplay.id} isOwner={isOwner} isAdmin={isAdmin}/>
            <MessageInput chatId={props.toDisplay.id}/>
        </div>
    )
}

export default Chat;
