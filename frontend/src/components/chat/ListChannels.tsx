import MenuIcon from '@mui/icons-material/Menu';
import LockIcon from '@mui/icons-material/Lock';  // lock icon for channels protected by password
import { Tooltip } from '@mui/material';
import { allChatOfUser } from './ChatComponent';
import "./ListChannels.scss"
import { useContext, useState, useEffect } from 'react';
import { WebsocketContext } from '../../context/chatContext';
import  ConnectionContext from "../../context/authContext";
import ChatContext from '../../context/chatContext';

export const ListChannels = (props: {chatsOfUser: allChatOfUser[], showSubMenu: string, setShowSubMenu: Function}) => {

    const socket = useContext(WebsocketContext);
	// const [idChatRoom, setIdChatRoom] = useState<JoinChatRoomPayload[]>([]);
	const {username} = useContext(ConnectionContext);
	const {setChatId} = useContext(ChatContext);
	const [id, setId] = useState('');

	// useEffect(() => {
	// 	socket.on('onJoinChatRoom', (idChatRoom: JoinChatRoomPayload) => {
	// 		if (idChatRoom.id === '-1')
	// 		{

	// 			setId('Doesnt exist')
	// 		}
	// 		else{
	// 			// ici c'est faux si je te renvoie -2 c'est protege par du password
	// 			// -3 c'est prive
	// 			//sinon c'est good



	// 			setChatId(parseInt(idChatRoom.id));
	// 			setIdChatRoom((prev) => [...prev, idChatRoom]);
	// 		}
	// 	  });
	// 	  return () => {
	// 		socket.off('onJoinChatRoom');
	// 	};
	// }, []);

	const DealWithIdChat = async () => {
		const returnValue = await SendIdChat();
		if (returnValue === "-1") {
		 		// ici c'est faux si je te renvoie -2 c'est protege par du password
				// -3 c'est prive
				//sinon c'est good
				setId('Doesnt exist')
		} else {
		  // Handle other cases
			setChatId(parseInt(returnValue.id));
		}
	  }

	  const SendIdChat = async () => {
		if (id === "") {
		  return ""; // Return an empty string or another default value
		}
		const messageData = {
		  username: username,
		  chat_id: id,
		  user_role: "user",
		};

		const requestOptions = {
		  method: 'post',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(messageData),
		};

		try {
		  const response = await fetch('http://localhost:4000/chatOption/joinChat/', requestOptions);

		  if (!response.ok) {
			throw new Error('Request failed');
		  }

		  const data = await response.json();
		  console.log('Success:', data);

		  // Return the data or a specific value from the response
		  return data; // You can return a specific field if needed
		} catch (error) {
		  console.error('Error:', error);
		  return "-1"; // Return "-1" or another specific value to indicate an error
		}
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
				  <button onClick={DealWithIdChat}>Join</button>
        </div>
    </div>
    );
}
