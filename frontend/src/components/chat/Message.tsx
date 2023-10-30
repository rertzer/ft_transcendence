import "./Message.scss"
import { useContext, useState } from "react";
import  ConnectionContext from "../../context/authContext"
import CloseIcon from '@mui/icons-material/Close';
import { WebsocketContext } from "../../context/chatContext";

const  Message = (props: {username: string, date: string, msg: string, isOwner: boolean, isAdmin: boolean, chatId: number}) => {

    const {username} = useContext(ConnectionContext);
    const [showUserActionsMenu, setShowUserActionsMenu] = useState(false);
   const socket = useContext(WebsocketContext);
	let isMessageOwner = false;
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
		console.log("requestOptions", requestOptions)
		fetch('http://localhost:4000/setAdmin/', requestOptions)
		console.log("send new admin")
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
                {(props.isAdmin || props.isOwner) && <div>Kick</div>}
                {(props.isAdmin || props.isOwner) && <div>Ban</div>}
                {(props.isAdmin || props.isOwner) && <div>Mute</div>}
                {props.isOwner && <div onClick={() => sendNewAdmin()}>
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
