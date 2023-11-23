import SettingsIcon from '@mui/icons-material/Settings';
import { Tooltip } from '@mui/material';
import "./ChannelSettings.scss"
import { useContext, useState } from 'react';
import ChatContext, {WebsocketContext} from '../../context/chatContext';
import { useLogin } from "../../components/user/auth";
import { act } from 'react-dom/test-utils';


export const ChannelSettings = (props: {showSubMenu: string, setShowSubMenu: Function}) => {

    const socket = useContext(WebsocketContext);
    const {activeChannel, setNeedToUpdate} = useContext(ChatContext);
    const [userToInvite, setUserToInvite] = useState('');
	const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const auth = useLogin();


    const toggleForm = () => {
        if (props.showSubMenu !== "settings") {
            props.setShowSubMenu("settings");
      } else {
          props.setShowSubMenu("none");
      }
    }

    async function updatePassword() {
        if (password === "") {
            setErrorMessage("Password cannot be left empty");
            return;
        }
        const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json',
			Authorization: auth.getBearer()},
			body: JSON.stringify({ password: password, type: "protected by password", chatId: activeChannel.id, login: auth.user.login})
		};
		const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/changeType/`, requestOptions);
		const data = await response.json();
        if (data) {
            toggleForm();
            setErrorMessage("");
            setPassword("");
            setUserToInvite("");
            const messageData = {
                username: auth.user.username,
                login:auth.user.login,
                content: "This channel is now protected by a new password",
                serviceMessage: true,
                idOfChat: activeChannel.id,
            }
            socket.emit('newMessage', messageData);
            activeChannel.type = "protected by password";
        }
        else
            setErrorMessage("Oops, an error occured while updating password")
    }

    async function changeChannelType(newType: string) {
        const requestOptions = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' ,
			Authorization: auth.getBearer() },
			body: JSON.stringify({ password: "", type: newType, chatId: activeChannel.id, login: auth.user.login})
		};
		const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/changeType/`, requestOptions);
		const data = await response.json();
        if (data){
            toggleForm();
            setErrorMessage("");
            setPassword("");
            setUserToInvite("");
            const messageData = {
                username: auth.user.username,
                login:auth.user.login,
                content: "This channel is now " + newType,
                serviceMessage: true,
                idOfChat: activeChannel.id,
            }
            socket.emit('newMessage', messageData);
            activeChannel.type = newType;
        }
        else
            setErrorMessage("Oops, an error occured while changing channel type")
    }

    async function inviteUserToChannel() {

        /*
            const data = {
				login: login, (pour verifier si le user est bien owner du channel)
                toInvite: userToInvite
				chat_id: activeChannel.id,
			};

            const requestOptions = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            };

            let returnValue = await fetch('http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/urlPourInviterQqunSurUnChannel', requestOptions)
            (verifier la valeur de retour pour set le message d'erreur si necessaire, et si tout va bien on ferme le menu et on re-render)
        */
    }

    return (
        <div className='channelManagement'>
            <Tooltip title="Channel Settings" arrow>
                <SettingsIcon onClick={toggleForm}/>
            </Tooltip>
            {props.showSubMenu === "settings" &&
                <div className='channelSettingsMenu'>
                    <div className="passwordManagement">
                        {activeChannel.type === "protected by password" &&
                            <div>
                                <span>Change channel password</span>
				                <input
					                type="password"
                                    maxLength={16}
					                placeholder='New password'
                                    value={password}
							        onChange={(e) => setPassword(e.target.value)}
					            />
				                <button onClick={updatePassword}>Change Password</button>
                                <div></div>
                                <span>Change channel type</span>
                                <div></div>
                                <button onClick={() => {changeChannelType("private")}}>Private</button>
                                <button onClick={() => {changeChannelType("public")}}>Public</button>
                            </div>
                        }
                        {activeChannel.type === "public" &&
                            <div>
                                <span>Add channel password</span>
                                <input
					                type="password"
                                    maxLength={16}
					                placeholder='Password'
                                    value={password}
							        onChange={(e) => setPassword(e.target.value)}
					            />
				                <button onClick={updatePassword}>Add Password</button>
                                <div></div>
                                <span>Change channel type</span>
                                <div></div>
                                <button onClick={() => {changeChannelType("private")}}>Private</button>
                            </div>
                        }
                        {activeChannel.type === "private" &&
                            <div>
                                <span>Add channel password</span>
                                <input
					                type="password"
                                    maxLength={16}
					                placeholder='Password'
                                    value={password}
							        onChange={(e) => setPassword(e.target.value)}
					            />
				                <button onClick={updatePassword}>Add Password</button>
                                <div></div>
                                <span>Change channel type</span>
                                <div></div>
                                <button onClick={() => {changeChannelType("public")}}>Public</button>
                            </div>
                        }
			        </div>
                    <hr/>
                    <div className='inviteUsers'>
                        <span>Invite a user to join the channel</span>
                        <input
					        type="text"
                            maxLength={32}
					       placeholder='Username'
                           value={userToInvite}
							onChange={(e) => setUserToInvite(e.target.value)}
					    />
                        <button onClick={inviteUserToChannel}>Invite</button>
                    </div>
                    {errorMessage !== "" &&
                        <div>
                            <hr/>
                            <p>{errorMessage}</p>
                        </div>
                    }
                </div>
            }
        </div>
    )
}
