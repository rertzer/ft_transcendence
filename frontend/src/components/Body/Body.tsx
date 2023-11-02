// import styles from "../pages/Desktop1.module.css";
import styles from "./Body.module.css";
import Numbers from "./Numbers/Numbers_dynamic";
import Letters from "./Letters/Letters_dynamic";
import Grid from "./Grid/Grid_dynamic";
import { MyContext } from "../../context/PageContext";
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import Desktop1 from "../../pages/Desktop1";

function CreateCell (coordX : number, coordY : number, width : number, height : number, text : string, border: string) {
  return (<div style={{
      position: 'absolute',
      top: `${16 + 16 * coordX}px`,
      left: `${38 + 80 * coordY}px`,
      width: `${80 * width}px`,
      height: `${16 * height}px`,
      color: `black`,
      font: '10px',
      backgroundColor: 'lightGrey',
      border: border,
      textAlign: 'center',
    }}>{text}</div>);
}

function Project () {
  return (
    <div>
      {CreateCell(1, 1, 2, 1, "Points", "2px solid black")}
      {CreateCell(2, 1, 1, 1, "User1", "1px solid black")}
      {CreateCell(2, 2, 1, 1, "User2", "1px solid black")}
      {CreateCell(3, 1, 1, 1, "1", "1px solid black")}
      {CreateCell(3, 2, 1, 1, "4", "1px solid black")}
      {CreateCell(3, 100, 1, 1, "4", "1px solid black")}
    </div>);
}

function Data () {
  return (
    <div>
      {CreateCell(1, 1, 4, 1, "Statistics", "2px solid black")}
      {CreateCell(3, 1, 1, 1, "Wins", "1px solid black")}
      {CreateCell(4, 1, 1, 1, "150", "1px solid black")}
      {CreateCell(3, 2, 1, 1, "Looses", "1px solid black")}
      {CreateCell(4, 2, 1, 1, "4", "1px solid black")}
      {CreateCell(3, 4, 1, 1, "Classement", "1px solid black")}
      {CreateCell(4, 4, 1, 1, "18000e", "1px solid black")}
    </div>);
}

function Friends () {
  return (
    <div>
      {CreateCell(1, 1, 3, 1, "Amis", "1px solid black")}
      {CreateCell(2, 1, 1, 1, "Richard", "0.5px solid black")}
      {CreateCell(2, 2, 1, 1, "Block", "0.5px solid red")}
      {CreateCell(2, 3, 1, 1, "Message", "0.5px solid green")}
      {CreateCell(3, 1, 1, 1, "Patrick", "0.5px solid black")}
      {CreateCell(3, 2, 1, 1, "Block", "0.5px solid red")}
      {CreateCell(3, 3, 1, 1, "Message", "0.5px solid green")}
    </div>);
}

function BarSwitch () {

  const context = useContext(MyContext);
  switch(context?.page) {
    case "Project" :
      return Project();
    case "Data" :
      return Data();
    case "Friends" :
      return Friends();
    case "Chat" :
      return ;
    default :
      return;
  }
}

export function Body({}) {
  const context = useContext(MyContext);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState({ scrollTop: 0, scrollLeft: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableRef.current) {
        const scrollTop = scrollableRef.current.scrollTop;
        const scrollLeft = scrollableRef.current.scrollLeft;
        setScrollPosition({ scrollTop, scrollLeft });
        console.log(`ScrollTop: ${scrollTop}, ScrollLeft: ${scrollLeft}`);
      }
    };
    if (scrollableRef.current) {
      scrollableRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableRef.current) {
        scrollableRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  return (
      <div className={styles.body} ref={scrollableRef}>
        <div className={styles.grid}>
          <Grid />
        </div>

        {BarSwitch()}

        <div className={styles.up} />
        <div className={styles.rightLettersFrame}>
          <div className={styles.rightLettersBackground} />
          <Numbers />
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
      </div>
  )
}
  