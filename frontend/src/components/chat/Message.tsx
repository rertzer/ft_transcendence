import "./Message.scss"
import { useContext, useEffect, useState } from "react";
import  ConnectionContext from "../../context/authContext"
import CloseIcon from '@mui/icons-material/Close';
import { WebsocketContext } from "../../context/chatContext";

const  Message = (props: {username: string, date: string, msg: string, isOwner: boolean, isAdmin: boolean, chatId: number}) => {

    const {username} = useContext(ConnectionContext);
    const [showUserActionsMenu, setShowUserActionsMenu] = useState(false);
   const socket = useContext(WebsocketContext);
	let isMessageOwner = false;

	useEffect(() => {
		socket.on("userIsMute", (userIsMute:boolean) => {
			//console.log("receive something");
			if(!userIsMute) // il faudra afficher un truc dans ca cas la
				console.log("user already mutted");
		})
        return () => {
            //console.log('Unregistering Events...');
			socket.off("userIsMute");
		}
    }, [])

    if (username === props.username) {
        isMessageOwner = true;
    }

    function toggleUserActionsMenu() {
        setShowUserActionsMenu(!showUserActionsMenu);
    }

	function sendNewAdmin() {

		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		//console.log("requestOptions", requestOptions)
		fetch('http://localhost:4000/chatOption/setAdmin/', requestOptions)
		//console.log("send new admin")
	}

	function muteUser() { // il faudra que client remplisse le time
		socket.emit("mutedUser", {username: props.username, chatId: props.chatId, time: 30 })
	}

	function banUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		//console.log("requestOptions", requestOptions)
		fetch('http://localhost:4000/chatOption/banUser/', requestOptions)
		//console.log("Banned user")
	}

	function kickUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		//console.log("requestOptions", requestOptions)
		fetch('http://localhost:4000/chatOption/kickUser/', requestOptions)
		//console.log("kickUser user")
	}

    return (
        <div className={isMessageOwner ? "message owner" : "message"}>
            <div className='messageInfo'>
                {isMessageOwner ?
                    <div>
                        <img src="" />  {/*faudra mettre la photo de profil ici   */}
                    </div> :
                    <div>
                        <img src="" style={{cursor:"pointer"}} onClick={toggleUserActionsMenu}/>
                    </div>}
            </div>
            <div className={showUserActionsMenu ? "userActions" : "userActions-hidden"}>
                <div className="menuHeader">
                    <h4>{props.username}</h4>
                    <CloseIcon style={{cursor:"pointer"}} onClick={toggleUserActionsMenu}/>
                </div>
                <hr></hr>
                <div>Invite to play</div>
                <div>Add to friends</div>
                <div>Send DM</div>
                <div>Show profile</div>
                {(props.isAdmin || props.isOwner) && <div onClick={kickUser}>Kick</div>}
                {(props.isAdmin || props.isOwner) && <div onClick={banUser}>Ban</div>}
                {(props.isAdmin || props.isOwner) && <div onClick={muteUser}>Mute</div>}
                {props.isOwner && <div onClick={sendNewAdmin}>
					Set as admin </div>}
            </div>
            <div className='messageContent'>
                <p>{props.msg}</p>
                <div className="name-time">
                    {username === props.username ? <span></span> : <span>{props.username},</span>}
                    <span>{props.date}</span>
                </div>
            </div>
        </div>
    )
}

export default Message;
