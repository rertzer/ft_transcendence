import "./Message.scss"
import { useContext, useState } from "react";
import  ConnectionContext from "../../context/authContext"
import CloseIcon from '@mui/icons-material/Close';

const Message = (props: {username: string, date: string, msg: string, isOwner: boolean, isAdmin: boolean}) => {

    const {username} = useContext(ConnectionContext);
    const [showUserActionsMenu, setShowUserActionsMenu] = useState(false);

    let isMessageOwner = false;
    if (username === props.username) {
        isMessageOwner = true;
    }

    function toggleUserActionsMenu() {
        setShowUserActionsMenu(!showUserActionsMenu);
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
                {props.isOwner && <div>Set as admin</div>}
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
