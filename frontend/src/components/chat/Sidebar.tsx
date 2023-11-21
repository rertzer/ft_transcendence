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
        console.log(allChannels);
        const id = activeChannel.id;
        if (needToUpdate === "" && id !== -1 && allChannels.find(element => element.id === id) === undefined)
            setActiveChannel({id: -1, channelName: "PongOffice Chat", chatPicture: "", type: "", status: "", username: null, dateSend: null, msg: null});
        else if (needToUpdate === "addChat") {
            setActiveChannel(allChannels[allChannels.length - 1]);
			socket.emit('retrieveMessage', {chatId: allChannels[allChannels.length - 1].id, messageToDisplay: 15 })
            setNeedToUpdate("");
        }
        else if (needToUpdate.indexOf("newDM ") === 0) {
            const name = needToUpdate.substring(6);
            const newDM = allChannels.find((element) => {
                if (element.type !== "DM")
				return false;
			const name1 = element.channelName.substring(0, element.channelName.indexOf(" "));
			const name2 = element.channelName.substring(element.channelName.indexOf(" ") + 1);
			if (name === name1 || name === name2)
				return true;
			return false;
            });
            if (newDM) {
                setActiveChannel(newDM);
                setNeedToUpdate("");
            }
        }
        else if (needToUpdate.indexOf("joinedChat ") === 0  && allChannels.length > 0) {
            const joinedId = parseInt(needToUpdate.substring(11));
            const channelJoined = allChannels.find(element => element.id === joinedId)
            if (channelJoined !== undefined) {
                console.log("JOINED FOUND")
                setActiveChannel(channelJoined);
                socket.emit('retrieveMessage', {chatId: channelJoined.id, messageToDisplay: 15 })
                setNeedToUpdate("");
            }
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
