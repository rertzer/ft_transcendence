import styles from "../pages/Desktop1.module.css";

export function Header({}) {
  return <header className={styles.headerFrame}>
        <div className={styles.headerBackground} />
        <div className={styles.line3}>
          <div className={styles.tchatbox} />
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
        <div className={styles.textBar}>
          <div className={styles.textBar1} />
          <div className={styles.file}>
            <div className={styles.file1}>File</div>
          </div>
          <div className={styles.settings}>
            <div className={styles.settings1}>Settings</div>
          </div>
          <div className={styles.contact}>
            <div className={styles.settings1}>Contact</div>
          </div>
          <div className={styles.data}>
            <div className={styles.data1}>Data</div>
          </div>
          <div className={styles.history}>
            <div className={styles.settings1}>History</div>
          </div>
          <div className={styles.profile}>
            <div className={styles.profile1}>Profile</div>
          </div>
        </div>
        <div className={styles.titleBar}>
          <div className={styles.titleBarBackground} />
          <div className={styles.untitled1}>Untitled 1 - PongOffice Calc</div>
          <div className={styles.user}>
            <img className={styles.userChild} alt="" src="/ellipse-1@2x.png" />
            <div className={styles.user1}>User</div>
            <img className={styles.crossIcon} alt="" src="/cross.svg" />
          </div>
        </div>
      </header>;
}
  