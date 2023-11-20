import "./ConversationBar.scss";
import ProfileIcon from '@mui/icons-material/AccountBoxOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";
import ConnectionContext from '../../context/authContext'
import ChatContext from '../../context/chatContext'
import { useContext, useState, useRef, useEffect } from "react";
import { ChannelSettings } from "./ChannelSettings";
import { useLogin } from "../../components/user/auth";


const ConversationBar = (props: {isOwner: boolean, isAdmin: boolean}) => {

	const auth = useLogin();
    const {activeChannel, setActiveChannel} = useContext(ChatContext);
    const [showSubMenu, setShowSubMenu] = useState("none");
    let menuRef = useRef<HTMLInputElement>(null);

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
                                <LogoutIcon />
                            </Tooltip>
                        }
                        <Tooltip title="Close conversation" arrow>
                            <CloseIcon onClick={() => {setActiveChannel({id: -1, channelName: "PongOffice Chat", chatPicture: "", status: "", type: "", username: null, dateSend: null, msg: null})}} />
                        </Tooltip>
                    </div>
                </div>
            </div>
)}

export default ConversationBar;
