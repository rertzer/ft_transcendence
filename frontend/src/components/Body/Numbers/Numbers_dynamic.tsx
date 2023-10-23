import React, { useContext, useState, useEffect, useRef } from 'react';
import { MyContext } from '../../../contexts/PageContext';
import styles from "./Numbers.module.css";

function RepeatingNumbers() {
  const windowHeightRef = useRef(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      windowHeightRef.current = window.innerHeight;
      // Trigger a re-render of the component when window.innerHeight changes
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

  const [localCoordY, setLocalCoordY] = useState(coordY);

  useEffect(() => {
    setLocalCoordY(coordY);
  }, [coordX, coordY]);

  const components = [];
  for (let i = 1; i * 16 < windowHeightRef.current; i++) {
    const dynamicTop = `${(i) * 16 - 16}px`;
    if (i == localCoordY + 1)
    {
      components.push(
      <div style={{
          position: 'absolute',
          top: dynamicTop,
          left: '0px',
          width: '25px',
          height: '16px',
          backgroundColor: '#15539E',
          fontWeight:'bold',
          outline:'0px solid #104482',
        }}>
          <div className={styles.numberGroupChild} />
          <div className={styles.numbers}>{i}</div>
      </div>
    );}
    else
    {
      components.push(
        <div style={{
            position: 'absolute',
            top: dynamicTop,
            left: '0px',
            width: '25px',
            height: '16px',
          }}>
            <div className={styles.numberGroupChild} />
            <div className={styles.numbers}>{i}</div>
        </div>
      );
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

export default RepeatingNumbers;
