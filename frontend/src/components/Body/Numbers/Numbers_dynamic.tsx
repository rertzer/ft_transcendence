import React, { useContext, useState, useEffect, useRef } from 'react';
import { MyContext } from '../../../context/PageContext';
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

  const { coords, updateCoords } = context;
  const { coordX, coordY } = coords;

  const [localCoordX, setLocalCoordX] = useState(coordX);
  const [localCoordY, setLocalCoordY] = useState(coordY);
  
  const handleUpdateCoords = (a: number, b: number) => {
    setLocalCoordX(a);
    setLocalCoordY(b);
    updateCoords({ coordX: a, coordY: b });
  };

  useEffect(() => {
    setLocalCoordX(coordX);
    setLocalCoordY(coordY);
  }, [coordX, coordY]);

  const { scroll, updateScroll } = context;
  const { scrollX, scrollY } = scroll;
  const { zoom, updateZoom } = context;
  const { toolbar } = context;

  const [sx, setNewScrollX] = useState(scrollX);
  const [sy, setNewScrollY] = useState(scrollY);
    
  useEffect(() => {
    setNewScrollX(scrollX);
    setNewScrollY(scrollY);
  }, [scrollX, scrollY]);

  const components = [];
  for (let index = 1; index * (20 + (zoom - 100)/8) < windowHeightRef.current; index++) {
    const i = index + sx;
    const dynamicTop = `${(index) * (20 + (zoom - 100)/8) - (20 + (zoom - 100)/8)}px`;
    if (i === localCoordY + 1 || localCoordY === -1)
    {
      components.push(
      <div  key={`y:${i}`}
            style={{
              position: 'absolute',
              top: dynamicTop,
              left: '0px',
              width: '31px',
              height: `${(20 + (zoom - 100)/8)}px`,
              backgroundColor: '#15539E',
              fontWeight:'bold',
              outline:'0px solid #104482',}}
            onMouseDown={() => handleUpdateCoords(-1, i - 1)}>
          <div className={styles.numberGroupChild} style={{height: `${(20 + (zoom - 100)/8)}px`,}}/>
          <div className={styles.numbers} style={{height: `${(20 + (zoom - 100)/8)}px`, fontSize: `${14 +((zoom - 100)/32)}px`,}}>{i}</div>
      </div>
    );}
    else
    {
      components.push(
        <div  key={`y:${i}`}
              style={{
                position: 'absolute',
                top: dynamicTop,
                left: '0px',
                width: '31px',
                height: `${(20 + (zoom - 100)/8)}px`,}}
            onMouseDown={() => handleUpdateCoords(-1, i - 1)}>
            <div className={styles.numberGroupChild} style={{height: `${(20 + (zoom - 100)/8)}px`,}} />
            <div className={styles.numbers} style={{height: `${(20 + (zoom - 100)/8)}px`,
          fontSize: `${14 +((zoom - 100)/32)}px`,}}>{i}</div>
        </div>
      );
    }
  }

  return (
    <div >
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
