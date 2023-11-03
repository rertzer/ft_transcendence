// import styles from "../pages/Desktop1.module.css";
import styles from "./Body.module.css";
import Numbers from "./Numbers/Numbers_dynamic";
import Letters from "./Letters/Letters_dynamic";
import Grid from "./Grid/Grid_dynamic";
import { MyContext } from "../../context/PageContext";
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import Desktop1 from "../../pages/Desktop1";



export function Body({}) {
  const context = useContext(MyContext);

  //HANDLE COORD CHANGE
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }

  const { coords, updateCoords } = context;
  const { coordX, coordY } = coords;

  const [x, setNewCoordX] = useState(coordX);
  const [y, setNewCoordY] = useState(coordY);

  const handleUpdateCoords = (a: number, b: number) => {
    setNewCoordX(a);
    setNewCoordY(b);
    updateCoords({ coordX: a, coordY: b });
  };

  useEffect(() => {
    setNewCoordX(coordX);
    setNewCoordY(coordY);
  }, [coordX, coordY]);

  //HANDLE SCROLL CHANGE
  const { scroll, updateScroll } = context;
  const { scrollX, scrollY } = scroll;

  const [sx, setNewScrollX] = useState(scrollX);
  const [sy, setNewScrollY] = useState(scrollY);
  
  const handleUpdateScroll = (event: any) => {
    let i = 0;
    if (event.deltaY < 0)
      i = -1;
    if (event.deltaY > 0)
      i = 1;
    if (event.shiftKey && sy + i >= 0)
      setNewScrollY(sy + i);
    else if (sx + i >= 0)
      setNewScrollX(sx + i);
    updateScroll({ scrollX: sx, scrollY: sy});
    console.log(sx, sy);
  };
  
  useEffect(() => {
    setNewScrollX(scrollX);
    setNewScrollY(scrollY);
  }, [scrollX, scrollY]);

  return (
      <div className={styles.body} onWheel={handleUpdateScroll}>

        <div className={styles.grid}>
          <Grid />
        </div>

        <div className={styles.up} onMouseDown={() => handleUpdateCoords(-1, -1)}/>
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