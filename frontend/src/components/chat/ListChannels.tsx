import MenuIcon from '@mui/icons-material/Menu';
import LockIcon from '@mui/icons-material/Lock';  // lock icon for channels protected by password
import { Tooltip } from '@mui/material';
import { allChatOfUser } from './ChatComponent';
import "./ListChannels.scss"
import { useContext, useState, useEffect } from 'react';
import { WebsocketContext } from '../../context/chatContext';
import  ConnectionContext from "../../context/authContext";
import ChatContext from '../../context/chatContext';

type JoinChatRoomPayload = {
	id: string;
	username: string;
	user_role: string;
}

export const ListChannels = (props: {chatsOfUser: allChatOfUser[], showSubMenu: string, setShowSubMenu: Function}) => {

    const socket = useContext(WebsocketContext);
	const [idChatRoom, setIdChatRoom] = useState<JoinChatRoomPayload[]>([]);
	const {username} = useContext(ConnectionContext);
	const {setChatId} = useContext(ChatContext);
	const [id, setId] = useState('');

	useEffect(() => {
		socket.on('onJoinChatRoom', (idChatRoom: JoinChatRoomPayload) => {
			//////console.log('onJoinChatRoom event received!');
			//////console.log(idChatRoom.id);
			if (idChatRoom.id === '-1')
			{
				//////console.log("wrong id")
				setId('Doesnt exist')
			}
			else{
				setChatId(parseInt(idChatRoom.id));
				//////console.log("id chat room", idChatRoom.id);
				setIdChatRoom((prev) => [...prev, idChatRoom]);
			}
		  });
		  return () => {
			//////console.log('Unregistering Events...');
			socket.off('onJoinChatRoom');
		};
	}, []);
	const SendIdChat = () => {
		if (id === "") {
			return;
		}
		const messageData = {
			username: username,
			chat_id: id,
			user_role: "user",
		}
		//////console.log("send id chat")
		//////console.log("id chat room", id);
		socket.emit('JoinChatRoom', messageData);
	}

    const toggleForm = () => {
        if (props.showSubMenu !== "list") {
            props.setShowSubMenu("list");
      } else {
          props.setShowSubMenu("none");
      }
    }

    return (
    <div className='listchannels'>
        <Tooltip title="List available channels" arrow>
            <MenuIcon onClick={toggleForm}/>
        </Tooltip>
        <div className={props.showSubMenu === "list" ? 'submenu' : "submenu-hidden"}>
            <p>Recuperer tableau de tous les channels publics ou proteges par password
                pour pouvoir le mapper et tout afficher (avec un petit logo cadenas si
                y a un password). Classer par ordre de creation (plus recent d'abord)
                ou par ordre alphabetique ? Fonction de recherche a implementer ?
                Chacun de ces elements pourra avoir un onClick qui permet de rejoindre
                le channel et d'updater le allChatOfUser (avec un sous-sous menu pour input
                le mot de passe quand y en a un...)
                Le fichier se trouve dans frontend/src/components/chat/ListChannels.tsx
                </p>
                <hr/>
                <p>
                    En attendant, j'ai mis l'ancien systeme pour rejoindre un chat ici pour pouvoir faire un peu le menage:
                </p>
                <hr/>
                <p>Enter the id chat room you want to join</p>
				  <input
					type="text"
					value={id}
					onChange={(e) => setId(e.target.value)}
				  />
				  <button onClick={SendIdChat}>Join</button>
        </div>
    </div>
    );
}
