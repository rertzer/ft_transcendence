import "./Message.scss"
import { useContext, useEffect, useState, useRef } from "react";
import  ConnectionContext from "../../context/authContext"
import { WebsocketContext } from "../../context/chatContext";
import { Link } from "react-router-dom";

const  Message = (props: {username: string, date: string, msg: string, isOwner: boolean, isAdmin: boolean, chatId: number, service: boolean, isDM: boolean}) => {

    const {username} = useContext(ConnectionContext);
    const [showUserActionsMenu, setShowUserActionsMenu] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
    const socket = useContext(WebsocketContext);
	let menuRef = useRef<HTMLInputElement>(null);
	let messageType = "normal";

	useEffect(() => {
		const clickHandler = (e: any) => {
			if (!menuRef.current?.contains(e.target)) {
				setShowUserActionsMenu(false);
			}
		};
		document.addEventListener("mousedown", clickHandler);
		return () => {
			document.removeEventListener("mousedown", clickHandler);
		}
	});

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

	async function checkIfUserIsBanned(userName: string, chatID: number) {

		try {
			const response = await fetch(`http://localhost:4000/chatOption/${props.username}/banned/${chatID}`);
			if (!response.ok) {
				throw new Error("Request failed");
			}
			const data = await response.json();
			if (data.isBanned) {
				return true;
			} else {
				return false;
			}
		}
		catch(error) {
			console.error("Error while checking if user is banned", error);
		}
	  }

    if (username === props.username) {
        messageType = "owner";
    }
	if (props.service) {
		messageType = "service";
	}

    function toggleUserActionsMenu() {
        setShowUserActionsMenu(!showUserActionsMenu);
		setErrorMessage("");
    }

	function sendServiceMessage(message: string) {
		const messageData = {
			username: username,
			content: message,
			serviceMessage: true,
			idOfChat: props.chatId,
		}
		socket.emit('newMessage', messageData);
	}

	async function sendNewAdmin() {

		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		const response = await fetch('http://localhost:4000/chatOption/setAdmin/', requestOptions)
		.catch((error) => {
			console.error('Error checking user status:', error);
		  });
		console.log("RESPONSE: ", response)
		toggleUserActionsMenu();
		sendServiceMessage(props.username + " is now an administrator of this channel");

	}

	function muteUser() {
		socket.emit("mutedUser", {username: props.username, chatId: props.chatId, time: 60 })
		toggleUserActionsMenu();
		sendServiceMessage(props.username + " has been muted for 1 min");
	}

	async function banUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: props.username, chatId: props.chatId})
		};
		let banned = await checkIfUserIsBanned(username, props.chatId);
		if (banned) {
			setErrorMessage(props.username + " is already banned");
		//bien sur faut aussi verifier si le user est owner auquel cas faut un autre error message
		} else {
			await fetch('http://localhost:4000/chatOption/banUser/', requestOptions);
			toggleUserActionsMenu();
			sendServiceMessage(props.username + " has been banned from this channel");
		}
	}

	async function kickUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login: props.username, chatId: props.chatId})
		};
		toggleUserActionsMenu();
		await fetch('http://localhost:4000/chatOption/kickUser/', requestOptions)
		sendServiceMessage(props.username + " has been kicked from this channel");
	}

	function startDM() {
		const messageData = {
			sender: username,
			receiver: props.username,
		}
		socket.emit('newPrivateConv', messageData);
		toggleUserActionsMenu();
	}

	async function addToFriends()
	{
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login: username, friendToAdd: props.username})
		};
		toggleUserActionsMenu();
		await fetch('http://localhost:4000/friend/addFriend/', requestOptions)

	}

	if (messageType !== "service") {
		return (
			<div className={messageType === "owner" ? "messageItem owner" : "messageItem"}>
				<div className='messageInfo'>
					{messageType === "owner" ?
						<div>
							<img src="" />  {/*faudra mettre la photo de profil ici   */}
						</div> :
						<div className="userOptions" ref={menuRef}>
							<img src="" style={{cursor:"pointer"}} onClick={toggleUserActionsMenu}/>
							<div className={showUserActionsMenu ? "userActions" : "userActions-hidden"}>
								<h4>{props.username}</h4>
								<hr></hr>
								<div className="menuItems">
									<div>Invite to play</div>
									<div onClick={addToFriends}>Add to friends</div>
									{props.isDM === false && <div onClick={startDM}>Send DM</div>}
									<Link to="/profile/1" style={{textDecoration:"none", color: "#ddddf7"}}>
										<div onClick={toggleUserActionsMenu}>Show profile</div>
									</Link>
									{(props.isAdmin || props.isOwner) && <div onClick={kickUser}>Kick</div>}
									{(props.isAdmin || props.isOwner) && <div onClick={banUser}>Ban</div>}
									{(props.isAdmin || props.isOwner) && <div onClick={muteUser}>Mute 1 minute</div>}
									{props.isOwner && <div onClick={sendNewAdmin}>Set as admin </div>}
								</div>
								{errorMessage !== "" && <div className="errorMessage">{errorMessage}</div>}
							</div>
						</div>}
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
		return (
			<div className="service-message" >
				<p>{props.msg}</p>
			</div>
			);
	}
}

export default Message;
