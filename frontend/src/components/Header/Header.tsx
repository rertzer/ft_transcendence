import { SelectBar } from './SelectBar';
import { Tooltip } from "@mui/material";
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import styles from "./Header.module.css";
import { useContext } from "react";
import  ConnectionContext from "../../context/authContext"

function Header({}) {

  const {username} = useContext(ConnectionContext);

  return <header className={styles.headerFrame}>
        <div className={styles.headerBackground} />
        <div className={styles.line3}>
          <input className={styles.tchatbox} />
          <img className={styles.buttonsIcon} alt="" src="/buttons.svg" />
          <div className={styles.menu}>
            <div className={styles.menuBackground} />
            <div className={styles.buttpn}>
              <div className={styles.buttonBackground} />
              <img className={styles.buttpnChild} alt="" src="/star-1.svg" />
            </div>
            <div className={styles.frameText}>
              <div className={styles.basicSansCs}>User2</div>
            </div>
          </div>
        </div>
        <div className={styles.line2}>
          <div className={styles.menu1}>
            <div className={styles.menuBackground} />
            <div className={styles.buttpn}>
              <div className={styles.buttonBackground} />
              <img className={styles.buttpnChild} alt="" src="/star-1.svg" />
            </div>
            <div className={styles.frameText1}>
              <div className={styles.pt}>0 pt</div>
            </div>
          </div>
          <div className={styles.menu2}>
            <div className={styles.menuBackground} />
            <div className={styles.buttpn}>
              <div className={styles.buttonBackground} />
              <img className={styles.buttpnChild} alt="" src="/star-1.svg" />
            </div>
            <div className={styles.frameText}>
              <div className={styles.basicSansCs}>Basic Sans Cs</div>
            </div>
          </div>
        </div>
        <SelectBar     />
        <div className={styles.titleBar}>
          <div className={styles.titleBarBackground} />
          <div className={styles.untitled1}>Untitled 1 - PongOffice Calc</div>
          <div className={styles.user}>
            <img className={styles.userChild} alt="" src="/ellipse-1@2x.png" style={{cursor:"pointer"}}/>
            <span className={styles.user1}>{username}</span>
            <Tooltip className={styles.crossButton}title="Log out" arrow>
              <img className={styles.crossIcon} alt="" src="/cross.svg" style={{cursor:"pointer", right: "8px"}}/>
            </Tooltip>
          </div>
        </div>
      </header>;
}

export default Header;