import "./Chats.scss";
import { WebsocketContext } from "../../context/chatContext";
import { useContext, useEffect, useRef } from 'react';
import ChatContext from "../../context/chatContext";
import { Channel } from './ChatComponent';
import { useLogin } from "../../components/user/auth";

const Chats = () => {

    const socket = useContext(WebsocketContext);
    const auth = useLogin();
	const {activeChannel, setActiveChannel, allChannels, setAllChannels, blockedUsers} = useContext(ChatContext);

    useEffect(() => {
        socket.emit('chatListOfUser', auth.user.login);
        socket.on("ListOfChatOfUser", (channelsListReceive : Channel[]) => {
            setAllChannels(channelsListReceive);
        });

        return () => {
			socket.off("ListOfChatOfUser");
        }
    }, [setAllChannels, socket, auth.user.login])

    const startRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (allChannels.length > 0) {
            startRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [allChannels.length]);

    function moveMostRecentUp(chatsOfUser: Channel[]) {

        chatsOfUser.sort((a: Channel, b: Channel) => {
            const aDate = a.dateSend;
            const bDate = b.dateSend;
            if (aDate === null && bDate !== null)
                return 1;
            else if (aDate !== null && bDate === null)
                return -1;
            else if (aDate === null || bDate === null)
                return 0;
            else if (aDate < bDate)
                return 1;
            else if (aDate > bDate)
                return -1;
            return 0;
    })
    return (chatsOfUser);
    }

    function findReceiverName(names: string) {

        let name = names.replace(auth.user.login, "");
        name.trim()
        return (name)
    }

    return (
        <div className='chats'>
            {allChannels.length === 0 ? (
				<div className='noConversations'>No conversations</div>
				) : (
					<div>
                        <div ref={startRef} />
						{moveMostRecentUp(allChannels).map((channel) => {
                            if (channel.type === "DM" && blockedUsers.find((element) => channel.channelName.indexOf(element.username) !== -1) !== undefined)
                                return (<div key={channel.id}></div>);
                            else
                                return (
                                <div key={channel.id} onClick={() => {
                                        if (channel.id !== activeChannel.id) {
                                        setActiveChannel(channel);
                                        socket.emit('retrieveMessage', {chatId: channel.id, messageToDisplay: 15 })
                                        }}}>
                                    <div className={activeChannel.id === channel.id ? "userChat active" : "userChat"}>
                                        <img src={channel.type !== "DM" ? "img1.png" : "recuperer l'avatar"} alt="user avatar"/>
                                        <div className='userChatInfo'>
                                            <h1>{channel.type !== "DM" ? channel.channelName : findReceiverName(channel.channelName)}</h1>
                                            {blockedUsers.find(element => element.idUser === channel.userId) && <p>blocked message</p>}
                                            {blockedUsers.find(element => element.idUser === channel.userId) === undefined && <p>{channel.msg ? channel.msg : ""}</p>}
                                        </div>
                                    </div>
                                </div>)
                        })}
			  		</div>
				)}
        </div>
    )
}

export default Chats;
