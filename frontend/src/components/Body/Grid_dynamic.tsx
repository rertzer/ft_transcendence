import React, { useState, useEffect, useRef } from 'react';


function Grid() {
  const windowHeightRef = useRef(window.innerHeight);
  const windowWidthRef = useRef(window.innerWidth);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  function updateXY(i: number, j: number) {
    setX(i);
    setY(j);
  }
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
  for (let i:number = 0; i * 80 < windowWidthRef.current; i++) {
    for (let j:number = 0; j * 16 < windowHeightRef.current; j++)
    {
        const dynamicLeft = `${(i) * 80}px`;
        const dynamicTop = `${(j) * 16}px`;
        if (i == x && j == y)
        {
          components.push(
            <div onClick={() => updateXY(i, j)} style={{
                position: 'absolute',
                top: dynamicTop,
                left: dynamicLeft,
                width: '80px',
                height: '16px',
                boxSizing: 'border-box',
                border: '2px solid #15539E',
            }}>
            </div>
          );
        }
        else
        {
          components.push(
            <div onClick={() => updateXY(i, j)} style={{
                position: 'absolute',
                top: dynamicTop,
                left: dynamicLeft,
                width: '80px',
                height: '16px',
                boxSizing: 'border-box',
                border: '1px solid #C0C0C0',
            }}>
            </div>
          );
        }
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