// import styles from "../pages/Desktop1.module.css";
import styles from "./Body.module.css";
import Numbers from "./Numbers/Numbers_dynamic";
import Letters from "./Letters/Letters_dynamic";
import Grid from "./Grid/Grid_dynamic";
import { MyContext } from "../../contexts/PageContext";
import React, { createContext, useContext, useState } from 'react';
import Desktop1 from "../../pages/Desktop1";

const rightBarSwitch = () => {

  const context = useContext(MyContext);
  switch(context?.page) {
    case "Project" :
      return (<div style={{
        color: 'black',
    }}>Project</div>);
    case "Data" :
      return (<div style={{
        color: 'black',
    }}>Data</div>);
    case "Friends" :
      return (<div style={{
        color: 'black',
    }}>Friends</div>);
    case "Chat" :
      return (<div style={{
        color: 'black',
    }}>Chat</div>)
    default :
      return;
  }
}

export function Body({}) {
  const context = useContext(MyContext);

  return <div className={styles.body}>
        <div className={styles.background} />
        <div className={styles.grid}>
        <Grid />
        {rightBarSwitch()}
        </div>
        <div className={styles.rightLettersFrame}>
          <div className={styles.rightLettersBackground} />
          <Numbers />
          <div className={styles.up} />
        </div>
        <div className={styles.letters}>
          <Letters />
        </div>
        <div className={styles.racketPlayer2}>
          <div className={styles.rightScrollZone} />
          <div className={styles.racket2} />
        </div>
        <div className={styles.racketPlayer1}>
          <div className={styles.rightScrollZone1} />
          <div className={styles.racket1} />
        </div>
      </div>;
}
  