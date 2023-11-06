import { SelectBar } from './SelectBar';
import { Tooltip } from "@mui/material";
import LogoutIcon from '@mui/icons-material/MeetingRoomOutlined';
import styles from "./Header.module.css";
import { useContext } from "react";
import  ConnectionContext from "../../context/authContext";
import { MyContext } from '../../context/PageContext';

function Header({}) {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { menu, updateMenu } = context;
  const { toolbar } = context;
  function handleClick(str : string) {
    updateMenu(str);
  }
  const {username} = useContext(ConnectionContext);

  return <header className={styles.headerFrame} style={{ height: toolbar ? '65px' : '142px' }}>
        <div className={styles.headerBackground} style={{ height: toolbar ? '65px' : '142px' }}/>
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
        <div className={styles.titleBar} onMouseEnter={() => handleClick("none")}>
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