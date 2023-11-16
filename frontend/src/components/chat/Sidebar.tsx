import "./Sidebar.scss"
import Chatbar from './Chatbar';
import Chats from "./Chats";
import { useEffect, useContext } from "react";
import ChatContext from "../../context/chatContext";

const Sidebar = () => {

    const {activeChannel, allChannels, setActiveChannel} = useContext(ChatContext);

    useEffect(() => {
        const id = activeChannel.id;
        console.log(activeChannel.id);
        if (id !== -1 && allChannels.find(element => element.id === id) === undefined) 
            setActiveChannel({id: -1, channelName: "Pong Chat", chatPicture: "", type: "", status: "", username: null, dateSend: null, msg: null});
        else if (id > -1)
            setActiveChannel(allChannels[allChannels.length - 1]);
    }, [allChannels.length])

    return (
        <div className='sidebar'>
            <Chatbar/>
            <Chats />
        </div>
    )
}

export default Sidebar;
