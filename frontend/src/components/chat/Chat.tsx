import "./Chat.scss";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { allChatOfUser } from "./ChatComponent";
import ConversationBar from "./ConversationBar";

const Chat = (props: {toDisplay: allChatOfUser, setActiveChat: Function}) => {

    return (
        <div className='chat'>
            <ConversationBar toDisplay={props.toDisplay} setActiveChat={props.setActiveChat}/>
            <Messages chatId={props.toDisplay.id}/>
            <MessageInput chatId={props.toDisplay.id}/>
        </div>
    )
}

export default Chat;
