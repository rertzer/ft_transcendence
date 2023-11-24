import ChatContext from "../../context/chatContext";
import BlockIcon from "@mui/icons-material/BlockOutlined";
import { Tooltip } from '@mui/material';
import { useContext, useState } from "react";
import "./UnblockUsers.scss"
import { useLogin } from "../user/auth";

export const UnblockUsers = (props: {showSubMenu: string, setShowSubMenu: Function}) => {

    const {blockedUsers, setBlockedUsers} = useContext(ChatContext);
    const [toUnblock, setToUnblock] = useState("");
    const auth = useLogin()

    const toggleForm = () => {
        if (props.showSubMenu !== "blocked") {
            props.setShowSubMenu("blocked");
      } else {
          props.setShowSubMenu("none");
      }
    }

    async function unblock() {
        const data = {
            blockedLogin: "TOTOOOOOOOO",
            login: auth.user.login,
        };
        const requestOptions = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' ,
            Authorization: auth.getBearer()},
            body: JSON.stringify(data),
        };
        try {
            const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/unblockUser/`, requestOptions);
            if (!response.ok)
                throw new Error("Request failed");
            const 
        }
    }

    return (
    <div className="blockedUsers">
        <Tooltip title="Blocked users" arrow>
            <BlockIcon onClick={toggleForm}/>
        </Tooltip>
        {props.showSubMenu === "blocked" &&
            <div className="blockedSubmenu">
                {toUnblock === "" ? <span>Blocked users</span> : <span>Do you want to unblock {toUnblock} ?</span>}
                {toUnblock !== "" && <button onClick={() => {unblock()}}>Unblock</button>}
                <div className="blockedList">
                    {blockedUsers.map((element) => {
                        return (<div className="blockedItem" key={element} onClick={() => {setToUnblock(element.toString())}}><p>User id number{element}</p></div>)
                    })}
                </div>
            </div>}
    </div>);
}