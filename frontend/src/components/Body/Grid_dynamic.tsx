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
        components.push(
          <div onMouseDown={() => updateXY(i, j)} style={{
              position: 'absolute',
              top: dynamicTop,
              left: dynamicLeft,
              width: '80px',
              height: '16px',
              boxSizing: 'border-box',
              borderTop: '1px solid #C0C0C0',
              borderRight: '1px solid #C0C0C0',
          }}>
          </div>)
    }
  }
  components.push(
    <div style={{
        position: 'absolute',
        top: `${y * 16}px`,
        left: `${x * 80}px`,
        width: '80px',
        height: '16px',
        boxSizing: 'border-box',
        border: '1px solid #15539E',
        outline: '1px solid #15539E',
    }}>
    </div>);
  components.push(<div style={{position: 'relative', top: `${y * 16 + 14}px`, left: `${x * 80 + 77}px`, width: '5px', height: '5px', backgroundColor:'#15539E',}}></div>);
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