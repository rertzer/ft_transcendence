import React from 'react';
import "./Chats.scss";
import { socket } from '../../context/chatContext';
import { WebsocketContext } from "../../context/chatContext";
import { useContext, useState, useEffect, useRef } from 'react';
import ConnectionContext from '../../context/authContext'


type allChatOfUser = {
    id: number;
    channelName: string;
    chatPicture: string;
    /*---------LastMessageReceive-------*/
    username: String;
    msg: string;
    dateSend: Date;
}


const Chats = (props: {activeChat: {id: number, name: string}, setActiveChat: Function}) => {

        const [chatsOfUser, setChatsOfUser] = useState<allChatOfUser[]>([])
        const socket = useContext(WebsocketContext);
    
    
        useEffect(() => {
    
            trigger();

            socket.on('chatList', (channelsListReceive : allChatOfUser[]) => {
                setChatsOfUser(channelsListReceive);
                // console.log("trigger chat list, what i receive :", channelsListReceive)
                // const add : allChatOfUser = {id:channelsListReceive.id, channelName: channelsListReceive.channelName, 
                //     chatPicture: channelsListReceive.chatPicture, username: channelsListReceive.username, msg: channelsListReceive.msg, dateSend: channelsListReceive.dateSend}
                // console.log("hey ")
                // console.log("Previous channelsList:", add);
                // setChatsOfUser((prevChat) => [...prevChat, add]);
                // // Debugging: Check the updated chatsList
                // console.log("Updated channelsList:", add);
            });

            return () => {
                console.log('Unregistering Events...');
            }
        }, [])
    
        const startRef = useRef<HTMLDivElement>(null); //ref to empty div to autoscroll to bottom
    
        useEffect(() => {
            if (chatsOfUser.length > 0) {
                startRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                });
            }
        }, [chatsOfUser.length]);
    
        const username = useContext(ConnectionContext);

        function trigger() {
            socket.emit('chatList', username);
        }

    return (
        <div className='chats'>
            {chatsOfUser.length === 0 ? (
				<div className='noConversations'>No conversations</div>
				) : (
					<div>
                        <div ref={startRef} />
						{chatsOfUser.map((channel) => (
                            <div onClick={props.setActiveChat(channel.id)}>
                                <div key={channel.id} className={props.activeChat.id === channel.id ? "userChat-active" : "userChat"}>
                                    <img src={channel.chatPicture} />
                                    <div className='userChatInfo'>
                                        <span>{channel.channelName}</span>
                                        <p>{channel.msg}</p>
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