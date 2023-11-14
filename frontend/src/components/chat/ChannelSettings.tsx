import SettingsIcon from '@mui/icons-material/Settings';
import { Tooltip } from '@mui/material';
import "./ChannelSettings.scss"

export const ChannelSettings = (props: {showSubMenu: string, setShowSubMenu: Function}) => {

    const toggleForm = () => {
        if (props.showSubMenu !== "settings") {
            props.setShowSubMenu("settings");
      } else {
          props.setShowSubMenu("none");
      }
    }

    return (
        <div className='channelManagement'>
            <Tooltip title="Channel Settings" arrow>
                <SettingsIcon onClick={toggleForm}/>
            </Tooltip>
            {props.showSubMenu === "settings" &&
                <div className='channelSettingsMenu'>
                    <div className="passwordManagement">
				        <span>Add or modify the channel password</span>
				        <input
					        type="password"
					        placeholder='Password'
					    />
				        <button>Set Password</button>
			        </div>
                    <hr/>
                    <div className='inviteUsers'>
                        <span>Invite a user to join the channel</span>
                        <input
					        type="text"
					       placeholder='User login'
					    />
                        <button>Invite</button>
                    </div>
                </div>
            }
        </div>
    )
}