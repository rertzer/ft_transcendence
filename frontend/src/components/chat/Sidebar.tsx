import "./Sidebar.scss"
import Chatbar from './Chatbar';
import Chats from "./Chats";
import { useEffect, useContext } from "react";
import ChatContext from "../../context/chatContext";
import { WebsocketContext } from "../../context/chatContext";

const Sidebar = () => {

	const socket = useContext(WebsocketContext);
    const {activeChannel, allChannels, setActiveChannel, needToUpdate, setNeedToUpdate} = useContext(ChatContext);

	useEffect(() => {
        const id = activeChannel.id;
        if (id !== -1 && allChannels.find(element => element.id === id) === undefined)
            setActiveChannel({id: -1, channelName: "You lost access to this channel", chatPicture: "", type: "", status: "", username: null, dateSend: null, msg: null});
        else if (needToUpdate && allChannels.length > 0) {
            setActiveChannel(allChannels[allChannels.length -1]);
			socket.emit('retrieveMessage', {chatId: allChannels[allChannels.length -1].id, messageToDisplay: 15 })
            setNeedToUpdate(false);
        }
    }, [allChannels.length])

    return (
        <div className='sidebar'>
            <Chatbar/>
            <Chats />
        </div>
    )
}

export default Sidebar;
