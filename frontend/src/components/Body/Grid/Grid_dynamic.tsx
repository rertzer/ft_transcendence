import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { MyContext } from '../../../context/PageContext';


function Grid() {
  const windowHeightRef = useRef(window.innerHeight);
  const windowWidthRef = useRef(window.innerWidth);

  const context = useContext(MyContext);
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

  const forceUpdate = useForceUpdate();

  const components = [];
  for (let i:number = 0; i * 80 < windowWidthRef.current; i++) {
    for (let j:number = 0; j * 16 < windowHeightRef.current; j++)
    {
        const dynamicLeft = `${(i) * 80}px`;
        const dynamicTop = `${(j) * 16}px`;
        components.push(
          <input key={`x:${i} y:${j}`} size={1} onMouseDown={() => handleUpdateCoords(i, j)} style={{
              position: 'absolute',
              top: dynamicTop,
              left: dynamicLeft,
              width: '80px',
              height: '16px',
              boxSizing: 'border-box',
              borderTop: '1px solid #C0C0C0',
              borderRight: '1px solid #C0C0C0',
              borderBottom: 'none',
              borderLeft: 'none',
              fontSize: '10px',
              textIndent: '3px',
          }}
          onFocus={(e) =>   {
            e.target.style.outline = 'none';
          }}>
          </input>)
    }
  }
  components.push(
    <div key={"highlight"} style={{
        position: 'absolute',
        top: `${y * 16}px`,
        left: `${x * 80}px`,
        width: '80px',
        height: '16px',
        boxSizing: 'border-box',
        border: '1px solid #15539E',
        outline: '1px solid #15539E',
        WebkitAppearance: 'none',
        boxShadow: 'none',
    }}>
    </div>);
  components.push(<div key={"bluesquare"} style={{position: 'relative', top: `${y * 16 + 14}px`, left: `${x * 80 + 77}px`, width: '5px', height: '5px', backgroundColor:'#15539E',}}></div>);
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