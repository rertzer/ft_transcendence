import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'
import { WebsocketContext } from "../../context/chatContext";
import { useState, useEffect, useContext } from 'react';

export type Active = {
	id: number;
    name: string
}

export type allChatOfUser = {
    id: number;
    channelName: string;
    chatPicture: string; //je pense que pour pas trop se faire chier et rendre le truc plus lisible on pourra mettre une image par defaut, genre une borne de pong, pour les channels pour bien les differencier des DM qui auront la profile pic du user

    /*Nouvelles variables pour differencier l'interface en fonction de la situation */
    isChannel: boolean; // true si le chat est un channel avec potentiellement du monde dessus, false si c'est des DM entre deux users
    receiverUsername: string // si c'est une conversation DM, on veut afficher le nom du destinataire a la place du nom du channel
    status : string;
    /*---------LastMessageReceive-------*/
    username: String | null; // bien differencier username et uid unique en cas de changement de username
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
    const [activeChat, setActiveChat] = useState<Active>({id: -1, name: "none"})
    const socket = useContext(WebsocketContext);
    let chatToDisplay = chatsOfUser.find(element => element.id === activeChat.id);
    const [lastMessage, setLastMessage] = useState<Message>({msg: "", username: "", date: new Date, id: 0, idOfChat: 0})

    useEffect(() => {
        socket.on('lastMessage', (lastMessage :{msg: string, username: string, date: Date, id: number, idOfChat:number}) => {
            console.log("lasts mesage receive : ", lastMessage);
            setLastMessage(lastMessage);
        });
        return () => {
            socket.off("lastMessage")
        } 
    },[])
    
    if (chatToDisplay !== undefined) {
    return (
        <div className="chatcomponent">
            <div className='container'>
                <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} chatsOfUser={chatsOfUser} setChatsOfUser={setChatsOfUser} lastMessage={lastMessage}/>
                <Chat toDisplay={chatToDisplay} setActiveChat={setActiveChat}/>
            </div>
        </div>
    )
    } else if (activeChat.id === -1) {
        return (
        <div className="chatcomponent">
            <div className='container'>
                <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} chatsOfUser={chatsOfUser} setChatsOfUser={setChatsOfUser} lastMessage={lastMessage}/>
                <div className='noChat'>Pong Chat</div>
            </div>
        </div>
        )
    }
    else {
        return (
            <div className="chatcomponent">
            <div className='container'>
                <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} chatsOfUser={chatsOfUser} setChatsOfUser={setChatsOfUser} lastMessage={lastMessage}/>
                <div className='noChat'>You lost permission to access : {activeChat.name}</div>
            </div>
        </div>
        )
    }
}

export default ChatComponent;
