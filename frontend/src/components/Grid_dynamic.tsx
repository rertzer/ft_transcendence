import React, { useState, useEffect, useRef } from 'react';
import styless from "./Letters.module.css";

function Grid() {
  const windowHeightRef = useRef(window.innerHeight);
  const windowWidthRef = useRef(window.innerWidth);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const handleResize = () => {
      windowWidthRef.current = window.innerWidth;
      windowHeightRef.current = window.innerHeight;
      // Trigger a re-render of the component when window.innerWidth changes
      forceUpdate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const components = [];
  for (let i = 0; i * 61 < windowWidthRef.current; i++) {
    for (let j = 0; j * 13 < windowHeightRef.current; j++)
    {
        const dynamicLeft = `${(i) * 61}px`;
        const dynamicTop = `${(j) * 13}px`;
        components.push(
        <div style={{
            position: 'absolute',
            top: dynamicTop,
            left: dynamicLeft,
            width: '61px',
            height: '13px',
            boxSizing: 'border-box',
            border: '1px solid #C0C0C0',
        }}>
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

export default Grid;