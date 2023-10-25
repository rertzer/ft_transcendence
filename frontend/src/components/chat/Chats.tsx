import "./Chats.scss";
import { WebsocketContext } from "../../context/chatContext";
import { useContext, useState, useEffect, useRef } from 'react';
import ConnectionContext from '../../context/authContext'
import { allChatOfUser } from './ChatComponent';
import { Active } from './ChatComponent';

const Chats = (props: {activeChat: Active, setActiveChat: Function, chatsOfUser: allChatOfUser[], setChatsOfUser: Function}) => {

    const [chatsOfUser, setChatsOfUser] = useState<allChatOfUser[]>([])
    const socket = useContext(WebsocketContext);
    const {username} = useContext(ConnectionContext);

    useEffect(() => {

        trigger();

        socket.on("ListOfChat", (channelsListReceive : allChatOfUser[]) => {
			console.log(channelsListReceive);
            setChatsOfUser(channelsListReceive);
			console.log("chat of user = ", chatsOfUser);
        });

        return () => {
            console.log('Unregistering Events...');
        }
    }, [])

    const startRef = useRef<HTMLDivElement>(null); //ref to empty div to autoscroll to bottom

    function trigger() {
       socket.emit('chatList', username);
    }
        
    useEffect(() => {
        if (chatsOfUser.length > 0) {
            startRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [chatsOfUser.length]);

    return (
        <div className='chats'>
            {chatsOfUser.length === 0 ? (
				<div className='noConversations'>No conversations</div>
				) : (
					<div>
                        <div ref={startRef} />
						{chatsOfUser.map((channel) => (
                            <div onClick={() => {
                                    if (channel.id !== parseInt(props.activeChat.id)) {
                                    props.setActiveChat({id: channel.id.toString(), name: channel.channelName});
                                    socket.emit('retrieveMessage', {chatId: channel.id, messageToDisplay: 15 })
                                    }}}>
                                <div key={channel.id} className={parseInt(props.activeChat.id) === channel.id ? "userChat active" : "userChat"}>
                                    <img src={channel.chatPicture === null ? "" : channel.chatPicture} />
                                    <div className='userChatInfo'>
                                        <h1>{channel.channelName}</h1>
                                        <p>{channel.msg === null ? "" : channel.msg}</p>
                                    </div>
                                </div>
                            </div>
			  			))}
			  		</div>
				)}
        </div>
    )
}

export default Chats;
