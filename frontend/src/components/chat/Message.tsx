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
	let messageType = "normal";

	useEffect(() => {
		socket.on("userIsMute", (userIsMute:boolean) => {

			if(!userIsMute) // il faudra afficher un truc dans ca cas la
				console.log("print something")
			else
				console.log(" i am mute");
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
        messageType = "owner";
    }
	if (props.msg.search("this channel") !== -1) { //evidemment, a remplacer par le booleen "serviceMessage"
		messageType = "service";
	}

    function toggleUserActionsMenu() {
        setShowUserActionsMenu(!showUserActionsMenu);
    }

	function sendServiceMessage(message: string) {
		const messageData = {
			username: username,
			content: message,
			idOfChat: props.chatId,
			//ajouter un boolean "serviceMessage" qui sera true ici, et false dans les messages normaux pour differencier l'affichage
		}
		socket.emit('newMessage', messageData);
	}

	function sendNewAdmin() {

		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		toggleUserActionsMenu();
		fetch('http://localhost:4000/chatOption/setAdmin/', requestOptions)
		.catch((error) => {
			console.error('Error checking user status:', error);
		  });
		sendServiceMessage(props.username + " is now an administrator of this channel");

	}

	function muteUser() { // il faudra que client remplisse le time
		console.log("plop try to muted")
		socket.emit("mutedUser", {username: props.username, chatId: props.chatId, time: 60 })
		toggleUserActionsMenu();
	}

	function banUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		toggleUserActionsMenu();
		fetch('http://localhost:4000/chatOption/banUser/', requestOptions)
		sendServiceMessage(props.username + " has been banned from this channel");
	}

	function kickUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		toggleUserActionsMenu();
		fetch('http://localhost:4000/chatOption/kickUser/', requestOptions)
		sendServiceMessage(props.username + " has been kicked from this channel");
	}

	if (messageType !== "service") {
		return (
			<div className={messageType === "owner" ? "message owner" : "message"}>
				<div className='messageInfo'>
					{messageType === "owner" ?
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
						{(props.isAdmin || props.isOwner) && <div onClick={muteUser}>Mute 1 minute</div>}
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
	} else {
		return (<div className="service-message">
			<p>{props.msg}</p>
			<div className="name-time">
				<span>Channel Bot,</span>
				<span>{props.date}</span>
			</div>
		</div>);
	}
}

export default Message;
