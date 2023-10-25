import "./Sidebar.scss"
import Chatbar from './Chatbar';
import Search from './Search';
import Chats from "./Chats";
import { allChatOfUser } from './ChatComponent';
import { Active } from './ChatComponent';

const Sidebar = (props: {activeChat: Active, setActiveChat: Function, chatsOfUser: allChatOfUser[], setChatsOfUser: Function}) => {


    return (
        <div className='sidebar'>
            <Chatbar chatsOfUser={props.chatsOfUser}/>
            <Search />
            <Chats activeChat={props.activeChat} setActiveChat={props.setActiveChat}
                   chatsOfUser={props.chatsOfUser} setChatsOfUser={props.setChatsOfUser} />
        </div>
    )
}

export default Sidebar;
