import "./ConversationBar.scss";
import ProfileIcon from '@mui/icons-material/AccountBoxOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";
import { allChatOfUser } from "./ChatComponent";
import {Link} from "react-router-dom";


const ConversationBar = (props: {toDisplay: allChatOfUser , setActiveChat: Function, isOwner: boolean, isAdmin: boolean}) => {

    console.log("LE CHAT A AFFICHER: ", props.toDisplay)
    // if (props.toDisplay.isChannel === false) {  //interface d'une fenetre de DM
    //     return (
    //     <div className='chatInfo'>
    //         <span>{/* nom du destinataire */}</span>
    //         <div className="chatIcons">
    //             <div>
    //                 <Tooltip title="View profile" arrow>
    //                     <Link to={"/profile/" + "1" /* remplacer par l'uid du destinataire*/} style={{textDecoration:"none"}}>
    //                         <ProfileIcon />
    //                     </Link>
    //                 </Tooltip>
    //             </div>
    //             <div>
    //                 <Tooltip title="Block user" arrow>
    //                     <BlockIcon />
    //                 </Tooltip>
    //             </div>
    //             <div>
    //                 <Tooltip title="Close conversation" arrow>
    //                     <CloseIcon onClick={() => {props.setActiveChat({id: -1, name: "none"})}} />
    //                 </Tooltip>
    //             </div>
    //         </div>
    //     </div>
    // );
    // } else 
        return (
            <div className='chatInfo'>
            <span>{props.toDisplay.channelName}</span>
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
                <div>
                    <Tooltip title="Leave channel" arrow>
                        <LogoutIcon />
                    </Tooltip>
                 </div>
                <div>
                    <Tooltip title="Close conversation" arrow>
                        <CloseIcon onClick={() => {props.setActiveChat({id: -1, channelName: "", chatPicture: "", isChannel: false, receiverUsername: "", status: "", username: null, dateSend: null, msg: null})}} />
                    </Tooltip>
                 </div>
            </div>
        </div>
        );
}

export default ConversationBar;