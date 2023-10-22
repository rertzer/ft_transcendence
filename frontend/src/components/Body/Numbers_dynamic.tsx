import React, { useState, useEffect, useRef } from 'react';
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

  const components = [];
  for (let i = 1; i * 16 < windowHeightRef.current; i++) {
    const dynamicTop = `${(i) * 16 - 16}px`;
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
