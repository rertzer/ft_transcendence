import React from 'react';
import "./Chats.scss";
import { socket } from '../../context/chatContext';
import { WebsocketContext } from "../../context/chatContext";
import { useContext, useState, useEffect, useRef } from 'react';


type allChatOfUser = {
    id: number;
    channelName: string;
    chatPicture: string;
    /*---------LastMessageReceive-------*/
    username: String;
    msg: string;
    dateSend: Date;
}


const Chats = () => {

        const [chatsOfUser, setChatsOfUser] = useState<allChatOfUser[]>([])
        const socket = useContext(WebsocketContext);
    
        //const [channelHistory, setChannelHistory] = useState<ChannelHistory[]>([]);
    
        useEffect(() => {
    
            socket.on('chatList', (channelHistoryReceive :{id: number, channelName: string, chatPicture: string, 
                                username: String, msg: string, dateSend: Date  }) => {
                console.log("trigger chat list, what i receive :", channelHistoryReceive)
                const add : allChatOfUser = {id:channelHistoryReceive.id, channelName: channelHistoryReceive.channelName, 
                    chatPicture: channelHistoryReceive.chatPicture, username: channelHistoryReceive.username, msg: channelHistoryReceive.msg, dateSend: channelHistoryReceive.dateSend}
                console.log("hey ")
                console.log("Previous channelHistory:", add);
                setChatsOfUser((prevChat) => [...prevChat, add]);
                // Debugging: Check the updated chatHistory
                console.log("Updated channelHistory:", add);
            });
            // socket.on('newMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number}) => {
    
            //     const newDateString = chatHistoryReceive.date.toString();
            //     const add : ChatHistory = {msg: chatHistoryReceive.msg, username: chatHistoryReceive.username, date: newDateString, id: chatHistoryReceive.id}
            //     setChatHistory((prevMessages) => [...prevMessages, add]);
            //     console.log("cat id : ", chatHistoryReceive.id);
            //     // Debugging: Check the updated chatHistory
            // });
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
    
    return (
        <div className='chats'>
            {chatsOfUser.length === 0 ? (
				<div>No conversations</div>
				) : (
					<div>
                        <div ref={startRef} />
						{chatsOfUser.map((channel) => (
							<div key={channel.id} className="userChat">
                                <img src={channel.chatPicture} />
                                <div className='userChatInfo'>
                                    <span>{channel.channelName}</span>
                                    <p>{channel.msg}</p>
                                </div>    
							</div>
			  			))}
			  		</div>
				)}
            {/* <div className="userChat">
                <img src="https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg" />
                <div className='userChatInfo'>
                    <span>mbocquel</span>
                    <p>Hello</p>
                </div>
            </div>*/}
        </div>
    )
}

export default Chats;