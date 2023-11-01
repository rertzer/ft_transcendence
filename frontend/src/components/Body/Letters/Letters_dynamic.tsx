import React, { useContext, useState, useEffect, useRef } from 'react';
import { MyContext } from '../../../context/PageContext';
import styles from "./Letters.module.css";

function RepeatingLetters() {
  const windowWidthRef = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      windowWidthRef.current = window.innerWidth;
      // Trigger a re-render of the component when window.innerWidth changes
      forceUpdate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const forceUpdate = useForceUpdate();

  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }

  const { coords } = context;
  const { coordX, coordY } = coords;

  const [localCoordX, setLocalCoordX] = useState(coordX);

  useEffect(() => {
    setLocalCoordX(coordX);
  }, [coordX, coordY]);

  const components = [];
  for (let i = 0; i * 80 < windowWidthRef.current; i++) {
    const dynamicLeft = `${(i) * 80}px`;
    let string = "";
    if (i == 0 || i == 26)
      string = "A";
    let j = i;
    if (j >= 26)
      j = j - 26;
    for (; j > 0; j = Math.floor(j / 26)) {
      string = String.fromCharCode((j%26)+65) + string;
    }
    if (i >= 26 && i < 52)
      string = "A" + string;
    if (i == localCoordX)
    {
      components.push(
      <div key={`x:${i}+${string}`}style={{
          position: 'absolute',
          top: '0px',
          left: dynamicLeft,
          width: '25px',
          height: '13px',
        }}>
          <div className={styles.background } style={{
          backgroundColor: '#15539E',
          fontWeight:'bold',
        }}>{string}</div>
          <div className={styles.letter} />
      </div>);
    }
    else
    {
      components.push(
        <div key={`x:${i}+${string}`}style={{
            position: 'absolute',
            top: '0px',
            left: dynamicLeft,
            width: '25px',
            height: '13px',
          }}>
            <div className={styles.background}>{string}</div>
            <div className={styles.letter} />
        </div>);
    }

    
  }
  return (
    <div>
        {components}
    </div>
  );
}

function useForceUpdate() {
  const [, setTick] = useState(0);
  const forceUpdate = () => {
    setTick((tick) => tick + 1);
  };
  return forceUpdate;
}

export default RepeatingLetters;
