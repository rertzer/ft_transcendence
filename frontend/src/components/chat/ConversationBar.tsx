import "./ConversationBar.scss";
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";
import ChatContext from '../../context/chatContext'
import { useContext, useState, useRef, useEffect } from "react";
import { ChannelSettings } from "./ChannelSettings";
import { useLogin } from "../../components/user/auth";
import { WebsocketContext } from '../../context/chatContext';
import { PageContext } from "../../context/PageContext";


const ConversationBar = (props: {isOwner: boolean, isAdmin: boolean}) => {

	const auth = useLogin();
    const {activeChannel, setActiveChannel} = useContext(ChatContext);
    const context = useContext(PageContext);
    if (!context) {
      throw new Error('useContext must be used within a MyProvider');
    }
    const { updateChat } = context;
    const [showSubMenu, setShowSubMenu] = useState("none");
    let menuRef = useRef<HTMLInputElement>(null);
    const socket = useContext(WebsocketContext);

    useEffect(() => {
		const clickHandler = (e: any) => {
			if (!menuRef.current?.contains(e.target)) {
				setShowSubMenu("none");
			}
		};
		document.addEventListener("mousedown", clickHandler);
		return () => {
			document.removeEventListener("mousedown", clickHandler);
		}
	});

    async function leaveChannel() {
        const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' ,
			Authorization: auth.getBearer()},
			body: JSON.stringify({ login: auth.user.login, chatId: activeChannel.id})
		};
		const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/kickUser/`, requestOptions);
        const messageData = {
			username: auth.user.username,
			login:auth.user.login,
			content: auth.user.username + " has just left",
			serviceMessage: true,
			idOfChat: activeChannel.id,
		}
		socket.emit('newMessage', messageData);
		const data = await response.json();
		if (data.isOwner)
			console.log("PLOP") //faudra surement faire un autre call, pour l'instant l'owner peut pas quitter son channel
    }

    function findReceiverName(names: string) {

        let name = names.replace(auth.user.login, "");
        name.trim()
        return (name)
    }
        return (
            <div>
                <div className='chatInfo'>
                    <span>{activeChannel.type !== "DM" ? activeChannel.channelName : findReceiverName(activeChannel.channelName)}</span>
                    {props.isOwner && <span>(owner)</span>}
                    {props.isAdmin && <span>(admin)</span>}
                    <div className="chatIcons">
                        {props.isOwner === true &&
                            <div ref={menuRef}>
                                <ChannelSettings showSubMenu={showSubMenu} setShowSubMenu={setShowSubMenu}/>
                            </div>
                        }
                        {activeChannel.type !== "DM" &&
                             <Tooltip title="Leave channel" arrow>
                                <LogoutIcon onClick={leaveChannel}/>
                            </Tooltip>
                        }
                        <Tooltip title="Close conversation" arrow>
                            <CloseIcon onClick={() => {updateChat('none')}} />
                        </Tooltip>
                    </div>
                </div>
            </div>
)}

export default ConversationBar;
