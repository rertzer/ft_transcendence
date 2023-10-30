import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'
import { useState } from 'react';

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
    adminUids: number[];  // a ajouter pour afficher ou non l'interface administrateur (j'ai mis un array dans le cas ou il y a plusieurs admin)
    ownerUid: number; // en relisant le sujet, il y a un seul owner (le createur, puis le premier admin si le createur quitte j'imagine), et c'est pas pareil que admin...
    /*---------LastMessageReceive-------*/
    username: String | null; // bien differencier username et uid unique en cas de changement de username
    msg: string| null;
    dateSend: Date | null;
}

const ChatComponent = () => {

    const [chatsOfUser, setChatsOfUser] = useState<allChatOfUser[]>([])
    const [activeChat, setActiveChat] = useState<Active>({id: -1, name: "none"})

    let chatToDisplay = chatsOfUser.find(element => element.id === activeChat.id);
    if (chatToDisplay !== undefined) {
    return (
        <div className="chatcomponent">
            <div className='container'>
                <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} chatsOfUser={chatsOfUser} setChatsOfUser={setChatsOfUser}/>
                <Chat toDisplay={chatToDisplay} setActiveChat={setActiveChat}/> :
            </div>
        </div>
    )
    } else {
        return (
            <div className="chatcomponent">
            <div className='container'>
                <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} chatsOfUser={chatsOfUser} setChatsOfUser={setChatsOfUser}/>
                <div className='noChat'>Pong Chat</div>
            </div>
        </div>
        )
    }
}

export default ChatComponent;
