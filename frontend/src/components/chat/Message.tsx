import "./Message.scss"
import { useContext, useEffect, useState, useRef } from "react";
import ChatContext, { WebsocketContext } from "../../context/chatContext";
import { Link } from "react-router-dom";
import { Channel } from "./ChatComponent";
import { useLogin } from "../../components/user/auth";
import GameContext from "../../context/gameContext";
import { Navigate } from "react-router-dom";

type uInfo = {
	userStatus: string, // "owner", "admin", "user", "banned", "out" (if kicked or left)
	friend: boolean
}

const  Message = (props: {username: string, login: string, date: string, msg: string, isOwner: boolean, isAdmin: boolean, chatId: number, service: boolean, isDM: boolean}) => {

    const auth = useLogin();
	const {roomId, setRoomId} = useContext(GameContext)
	const {allChannels, activeChannel, setActiveChannel, setNeedToUpdate} = useContext(ChatContext)
    const [showUserActionsMenu, setShowUserActionsMenu] = useState(false);
	const [userInfo, setUserInfo] = useState<uInfo>({userStatus: "user", friend: false})
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
        return () => {
			socket.off("userIsMute");
		}
    }, [])

	async function checkIfUserIsBanned() {

		try {
			const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/${props.login}/banned/${props.chatId}`);
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

    if (auth.user.login === props.login) {
        messageType = "owner";
    }
	if (props.service) {
		messageType = "service";
	}

	async function checkIfAlreadyFriend() {
		try {
			const response = await fetch(`http://localhost:4000/friend/${auth.user.login}/${props.login}/isMyFriend`);
			if (!response.ok) {
				throw new Error("Request failed");
			}
			const data = await response.json();
			if (data)
				return data;
		}
		catch(error) {
			console.error("Error while checking if user is friend", error);
		}
	}

	async function getUserInfo() {
		try {
			const response = await fetch(`http://localhost:4000/chatOption/${props.login}/info/${props.chatId}`);
			if (!response.ok) {
				throw new Error("Request failed");
			}
			const data = await response.json();
			if (data) {
				if (data.banned === true)
					return ("banned");
				if (data.kicked === true)
					return ("left");
				if (data.user_role === "user")
					return ("");
				return (data.user_role);
			}
		}
		catch(error) {
			console.error("Error while checking user info", error);
		}
	}

    async function toggleUserActionsMenu() {
		const info: uInfo = {userStatus: "", friend: false};
		if (showUserActionsMenu === false && props.isDM === false) {
			info.userStatus =  await getUserInfo();
			info.friend = await checkIfAlreadyFriend();
			setUserInfo(info);
		}
        setShowUserActionsMenu(!showUserActionsMenu);
		setErrorMessage("");
    }

	function sendServiceMessage(message: string) {
		const messageData = {
			username: auth.user.username,
			login:auth.user.login,
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
			body: JSON.stringify({ login: props.login, chatId: props.chatId})
		};
		const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/setAdmin/`, requestOptions)
		.catch((error) => {
			console.error('Error checking user status:', error);
		  });
		console.log("RESPONSE: ", response)
		toggleUserActionsMenu();
		sendServiceMessage(props.username + " is now an administrator of this channel");

	}

	function muteUser() {
		socket.emit("mutedUser", {login: props.login, chatId: props.chatId, time: 60 })
		toggleUserActionsMenu();
		sendServiceMessage(props.login + " has been muted for 1 min");
	}

	async function banUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login: props.login, chatId: props.chatId})
		};
		let banned = await checkIfUserIsBanned();
		if (banned) {
			setErrorMessage(props.username + " is already banned");
		} else {
			const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/banUser/`, requestOptions);
			const data = await response.json();
			if (data.isOwner)
				setErrorMessage(props.username + " cannot be banned since he or she owns this channel")
			else {
			toggleUserActionsMenu();
			sendServiceMessage(props.username + " has been banned from this channel");
			}
		}
	}

	async function kickUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login: props.login, chatId: props.chatId})
		};
		const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/kickUser/`, requestOptions);
		const data = await response.json();
		if (data.isOwner)
			setErrorMessage(props.username + " cannot be kicked since he or she owns this channel")
		else {
			toggleUserActionsMenu();
			sendServiceMessage(props.username + " has been kicked from this channel");
		}
	}

	function checkIfDmExists() {
		const index = allChannels.findIndex((element: Channel) => {
			if (element.type !== "DM")
				return false;
			const name1 = element.channelName.substring(0, element.channelName.indexOf(" "));
			const name2 = element.channelName.substring(element.channelName.indexOf(" ") + 1);
			if (props.username === name1 || props.username === name2)
				return true;
			return false;
		});
		return (index);
	}

	async function startDM() {

		let existingConversation = checkIfDmExists();
		if (existingConversation !== -1) {
			setActiveChannel(allChannels[existingConversation]);
			socket.emit('retrieveMessage', {chatId: allChannels[existingConversation].id, messageToDisplay: 15 })
		} else {
			const messageData = {
				sender: auth.user.login,
				receiver: props.login,
			}
			console.log(messageData)
			socket.emit('newPrivateConv', messageData);
			setNeedToUpdate("newDM " + props.username);
			toggleUserActionsMenu();
		}
	}

	async function addToFriends()
	{
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login: auth.user.login, friendToAdd: props.login})
		};
		toggleUserActionsMenu();
		await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/friend/addFriend/`, requestOptions)

	}


	async function blockUser() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({blockedLogin: props.login, login: auth.user.login})
		};
		const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/blockUser/`, requestOptions);
		const data = await response.json();
		console.log(data);
	}

	async function startGame() {
		const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({typeGame: "BASIC"})
		};
		const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/game/newRoom/`, requestOptions);
		const data = await response.json();
		sendServiceMessage("Classic game invitation received to play in room " + data.roomId)
		setRoomId(data.roomId);
	}

	function joinGame() {
		const indexOfId = props.msg.lastIndexOf(" ") + 1;
		const idToJoin = parseInt(props.msg.substring(indexOfId));
		setRoomId(idToJoin);
		// ajouter fetch pour supprimer le message de la DB
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
								{props.isDM || userInfo.userStatus === "" ? <h4>{props.username}</h4> : <h4>{props.username + " (" + userInfo.userStatus + ")"}</h4>}  
								<hr></hr>
								<div className="menuItems">
									{props.isDM && roomId === 0 && <div onClick={startGame}>Invite to play</div>}
									{userInfo.friend ? <div>Unfriend</div> : <div onClick={addToFriends}>Add to friends</div>}
									{props.isDM === false && <div onClick={startDM}>Send DM</div>}
									<Link to="/profile/1" style={{textDecoration:"none", color: "#ddddf7"}}>
										<div>Show profile</div>
									</Link>
									{((props.isAdmin || props.isOwner) && (userInfo.userStatus === "" || userInfo.userStatus === "admin")) &&
										<div onClick={kickUser}>Kick</div>}
									{((props.isAdmin || props.isOwner) && userInfo.userStatus !== "banned" && userInfo.userStatus !== "owner") &&
										<div onClick={banUser}>Ban</div>}
									{((props.isAdmin || props.isOwner) && (userInfo.userStatus === "" || userInfo.userStatus === "admin")) &&
										<div onClick={muteUser}>Mute 1 minute</div>}
									{(props.isOwner && userInfo.userStatus === "") &&
										<div onClick={sendNewAdmin}>Set as admin </div>}
									<div onClick={blockUser}>Block User</div>
								</div>
								{errorMessage !== "" && <div className="errorMessage">{errorMessage}</div>}
							</div>
						</div>}
				</div>
				<div className='messageContent'>
					<p>{props.msg}</p>
					<div className="name-time">
						{auth.user.login === props.username ? <span></span> : <span>{props.username},</span>}
						<span>{props.date}</span>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div className="service-message" >
				{(props.isDM && props.login !== auth.user.login) &&
					<div><p>{props.msg}</p><button onClick={joinGame}>Yes</button><button>No</button></div>}
				{(props.isDM && props.login === auth.user.login) &&
					<div><p>Classic game invitation sent</p></div>}
				{props.isDM === false && <p>{props.msg}</p>}
			</div>
			);
	}
}

export default Message;
