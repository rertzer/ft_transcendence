import "./Sidebar.scss"
import Chatbar from './Chatbar';
import Chats from "./Chats";

const Sidebar = () => {


    return (
        <div className='sidebar'>
            <Chatbar/>
            <Chats />
        </div>
    )
}

export default Sidebar;
