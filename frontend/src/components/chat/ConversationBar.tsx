import "./ConversationBar.scss";
import ProfileIcon from '@mui/icons-material/AccountBoxOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";
import { allChatOfUser } from "./ChatComponent";
import {Link} from "react-router-dom";


const ConversationBar = (props: {toDisplay: allChatOfUser, setActiveChat: Function}) => {

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
    // } else if (currentUser.uid === props.toDisplay.ownerUid)  { // interface de l'owner du channel
        return (
            <div className='chatInfo'>
            <span>{props.toDisplay.channelName}</span>
            <div className="chatIcons">
                <div>
                    <Tooltip title="Manage password" arrow>
                        <LockIcon />
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Block user" arrow>
                        <BlockIcon />
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Close conversation" arrow>
                        <CloseIcon onClick={() => {props.setActiveChat({id: -1, name: "none"})}} />
                    </Tooltip>
                 </div>
            </div>
        </div>
        );
    // } else if (props.toDisplay.adminUids.indexOf(currentUser.uid) !== -1) { // interface admin
    //     return (
    //         <div>

    //         </div>
    //     );
    // } else { // interface user classique
    //     return (
    //         <div>

    //         </div>
    //     );
    // }
}

export default ConversationBar;