import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'
import { WebsocketContext } from "../../context/chatContext";
import { useState, useEffect, useContext } from 'react';
import  ConnectionContext from "../../context/authContext"
import { act } from "react-dom/test-utils";
import userContext from "../../context/userContext";

export type allChatOfUser = {
    id: number;
    channelName: string;
    chatPicture: string;
    type : string;
    status: string;
    /*---------LastMessageReceive-------*/
    username: string | null; // bien differencier username et uid unique en cas de changement de username
    msg: string| null;
    dateSend: Date | null;
}

export type Message = {
    msg: string;
    username: string;
    date: Date;
    id: number;
    idOfChat: number;
}

const ChatComponent = () => {

    const [chatsOfUser, setChatsOfUser] = useState<allChatOfUser[]>([])
    const [activeChat, setActiveChat] = useState<allChatOfUser>({id: -1, channelName: "Pong Chat", chatPicture: "", type: "", status: "", username: null, dateSend: null, msg: null})
    const socket = useContext(WebsocketContext);
    const [lastMessage, setLastMessage] = useState<Message>({msg: "", username: "", date: new Date, id: 0, idOfChat: 0})

    useEffect(() => {
        socket.on('lastMessage', (lastMessage :{msg: string, username: string, date: Date, id: number, idOfChat:number}) => {
            setLastMessage(lastMessage);
        });
        return () => {
            socket.off("lastMessage")
        } 
    },[])
    
    useEffect(() => {
        const id = activeChat.id;
        if (id !== -1 && chatsOfUser.find(element => element.id === id) === undefined) 
            setActiveChat({id: -1, channelName: "Pong Chat", chatPicture: "", type: "", status: "", username: null, dateSend: null, msg: null})
    }, [chatsOfUser.length])

    return (
        <div className="chatcomponent">
            <div className='container'>
                <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} chatsOfUser={chatsOfUser} setChatsOfUser={setChatsOfUser} lastMessage={lastMessage}/>
                {activeChat.id > 0 ? <Chat toDisplay={activeChat} setActiveChat={setActiveChat}/> : <NoChat message={activeChat.channelName}/>}
            </div>
        </div>
    )
}

export default ChatComponent;


const NoChat = (props: {message: string}) => {

    const {user} = useContext(userContext);
    const socket = useContext(WebsocketContext);

    useEffect(() => {

    socket.on('newMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number, idOfChat:number, serviceMessage: boolean}) => {

        socket.emit("chatListOfUser",user.login);
    });
    return () => {
        socket.off('newMessage');
    }
}, [])

    return (<div className='noChat'>{props.message}</div>);
}