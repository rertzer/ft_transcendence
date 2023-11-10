import "./ConversationBar.scss";
import ProfileIcon from '@mui/icons-material/AccountBoxOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";
import { allChatOfUser } from "./ChatComponent";
import {Link} from "react-router-dom";
import ConnectionContext from '../../context/authContext'
import { useContext } from "react";


const ConversationBar = (props: {toDisplay: allChatOfUser , setActiveChat: Function, isOwner: boolean, isAdmin: boolean}) => {

    const {username} = useContext(ConnectionContext);

    function findReceiverName(names: string) {

        let name = names.replace(username, "");
        name.trim()
        return (name)
    }

        return (
            <div className='chatInfo'>
            <span>{props.toDisplay.type !== "DM" ? props.toDisplay.channelName : findReceiverName(props.toDisplay.channelName)}</span>
            {props.isOwner ? <span>(owner)</span> : <span></span>}
            {props.isAdmin ? <span>(admin)</span> : <span></span>}
            <div className="chatIcons">
                {props.isOwner === true ? 
                <div>
                    <Tooltip title="Manage password" arrow>
                        <LockIcon />
                    </Tooltip>
                </div> : <div></div>
                }
                {props.toDisplay.type !== "DM" ?        
                <div>
                    <Tooltip title="Leave channel" arrow>
                        <LogoutIcon />
                    </Tooltip>
                 </div> : <div></div>
                }               
                <div>
                    <Tooltip title="Close conversation" arrow>
                        <CloseIcon onClick={() => {props.setActiveChat({id: -1, channelName: "Pong Chat", chatPicture: "", isChannel: false, receiverUsername: "", status: "", username: null, dateSend: null, msg: null})}} />
                    </Tooltip>
                 </div>
            </div>
        </div>
        );
}

export default ConversationBar;