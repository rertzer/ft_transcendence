import "./Message.scss"
import { useContext, useEffect, useState } from "react";
import  ConnectionContext from "../../context/authContext"
import CloseIcon from '@mui/icons-material/Close';
import { WebsocketContext } from "../../context/chatContext";
import { Link } from "react-router-dom";

const  Message = (props: {username: string, date: string, msg: string, isOwner: boolean, isAdmin: boolean, chatId: number}) => {

    const {username} = useContext(ConnectionContext);
    const [showUserActionsMenu, setShowUserActionsMenu] = useState(false);
   const socket = useContext(WebsocketContext);
	let isMessageOwner = false;

	useEffect(() => {
		socket.on("userIsMute", (userIsMute:boolean) => {

			if(!userIsMute) // il faudra afficher un truc dans ca cas la
				console.log("print something")
		})
		// socket.on("BannedUser", (chat_id: Number)=> {
		// 	console.log("yo i have been banned");
		// })
        return () => {

			socket.off("userIsMute");
		}
    }, [])

	function checkIfUserIsBanned() { //this is the function to check if the username Is banned
		// implements it where u want
		fetch(`http://localhost:4000/chatOption/${username}/banned/${props.chatId}`)
		  .then((response) => response.json())
		  .then((data) => {
			if (data.isBanned) {
			  // Handle the case where the user is banned
			  console.log('You are banned.');
			} else {
			  // Handle the case where the user is not banned
			  console.log('You are not banned.');
			}
		  })
		  .catch((error) => {
			console.error('Error checking user status:', error);
		  });
	  }

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

		fetch('http://localhost:4000/chatOption/setAdmin/', requestOptions)
		.catch((error) => {
			console.error('Error checking user status:', error);
		  });

	}

	function muteUser() { // il faudra que client remplisse le time
		console.log("plop try to muted")
		socket.emit("mutedUser", {username: props.username, chatId: props.chatId, time: 30 })

	}

	function banUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		fetch('http://localhost:4000/chatOption/banUser/', requestOptions)
	}

	function kickUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		fetch('http://localhost:4000/chatOption/kickUser/', requestOptions)
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
				<div className="menuItems">
					<div>Invite to play</div>
					<div>Add to friends</div>
					<div>Send DM</div>
					<Link to="/profile/1" style={{textDecoration:"none", color: "#ddddf7"}}>
						<div onClick={toggleUserActionsMenu}>Show profile</div>
					</Link>
					{(props.isAdmin || props.isOwner) && <div onClick={kickUser}>Kick</div>}
					{(props.isAdmin || props.isOwner) && <div onClick={banUser}>Ban</div>}
					{(props.isAdmin || props.isOwner) && <div onClick={muteUser}>Mute</div>}
					{props.isOwner && <div onClick={sendNewAdmin}>
						Set as admin </div>}
				</div>
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
