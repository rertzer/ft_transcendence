import "./Chats.scss";
import { WebsocketContext } from "../../context/chatContext";
import React, { useContext, useState, useEffect, useRef, Component } from 'react';
import ConnectionContext from '../../context/authContext'
import ChatContext from "../../context/chatContext";
import { Channel } from './ChatComponent';

const Chats = () => {

    const socket = useContext(WebsocketContext);
    const {activeChannel, setActiveChannel, allChannels, setAllChannels} = useContext(ChatContext);
    const {username} = useContext(ConnectionContext);

    useEffect(() => {

        trigger();
        socket.on("ListOfChatOfUser", (channelsListReceive : Channel[]) => {
            setAllChannels(channelsListReceive);
        });

		socket.on("newChat", (newChat: Channel) => {
			setAllChannels([...allChannels, newChat]);
		});

        return () => {

			socket.off("ListOfChatOfUser");
			socket.off("newChat")
        }
    }, [])

    function trigger() {
        socket.emit('chatListOfUser', username);
    }

    const startRef = useRef<HTMLDivElement>(null); //ref to empty div to autoscroll to bottom
    
    useEffect(() => {
        if (allChannels.length > 0) {
            startRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, []);

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

        let name = names.replace(username, "");
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
						{moveMostRecentUp(allChannels).map((channel) => (
                            <div key={channel.id} onClick={() => {
                                    if (channel.id != activeChannel.id) {
                                    setActiveChannel(channel);
                                    socket.emit('retrieveMessage', {chatId: channel.id, messageToDisplay: 15 })
                                    }}}>
                                <div className={activeChannel.id === channel.id ? "userChat active" : "userChat"}>
                                    <img src={channel.chatPicture === null ? "" : channel.chatPicture} />
                                    <div className='userChatInfo'>
                                        <h1>{channel.type !== "DM" ? channel.channelName : findReceiverName(channel.channelName)}</h1>
                                        <p>{channel.msg ? channel.msg : ""}</p>
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
