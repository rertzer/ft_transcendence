import "./Sidebar.scss"
import Chatbar from './Chatbar';
import Chats from "./Chats";
import { Message } from "./ChatComponent";
import ChatComponent, { allChatOfUser } from './ChatComponent';

const Sidebar = (props: {activeChat: allChatOfUser, setActiveChat: Function, chatsOfUser: allChatOfUser[], setChatsOfUser: Function, lastMessage: Message}) => {


    return (
        <div className='sidebar'>
            <Chatbar chatsOfUser={props.chatsOfUser}/>
            <Chats activeChat={props.activeChat} setActiveChat={props.setActiveChat}
                   chatsOfUser={props.chatsOfUser} setChatsOfUser={props.setChatsOfUser} lastMessage={props.lastMessage} />
        </div>
    )
}

export default Sidebar;
