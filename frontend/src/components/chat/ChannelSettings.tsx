import SettingsIcon from '@mui/icons-material/Settings';
import { Tooltip } from '@mui/material';
import "./ChannelSettings.scss"
import { useContext, useState } from 'react';
import ChatContext from '../../context/chatContext';
import { act } from 'react-dom/test-utils';

export const ChannelSettings = (props: {showSubMenu: string, setShowSubMenu: Function}) => {

    const {activeChannel} = useContext(ChatContext);
    const [userToInvite, setUserToInvite] = useState('');
	const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");


    const toggleForm = () => {
        if (props.showSubMenu !== "settings") {
            props.setShowSubMenu("settings");
      } else {
          props.setShowSubMenu("none");
      }
    }

    async function updatePassword() {

        /* 
            const data = {
				login: login, (pour verifier si le user est bien owner du channel)
				chat_id: activeChannel.id,
				password: password,
			};

            const requestOptions = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            };

            let returnValue = await fetch('http://localhost:4000/chatOption/urlPourModifierLePasswordEtChangerLeTypeSiNecessaire', requestOptions)
            (verifier la valeur de retour pour set le message d'erreur si necessaire, et si tout va bien on ferme le menu et on re-render)
        */
    }

    async function changeChannelType(newType: string) {

        /* 
            const data = {
				login: login, (pour verifier si le user est bien owner du channel)
				chat_id: activeChannel.id,
				type: newType,
			};

            const requestOptions = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            };

            let returnValue = await fetch('http://localhost:4000/chatOption/urlPourModifierLeTypeDuChannel', requestOptions)
            (verifier la valeur de retour pour set le message d'erreur si necessaire, et si tout va bien on ferme le menu et on re-render)
        */
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

            let returnValue = await fetch('http://localhost:4000/chatOption/urlPourInviterQqunSurUnChannel', requestOptions)
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