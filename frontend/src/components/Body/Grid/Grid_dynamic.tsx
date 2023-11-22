import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { useContext } from 'react';
import { MyContext } from '../../../context/PageContext';
import { Project } from '../../Sheets/Project/Project';
import { Profile } from '../../Sheets/Profile/Profile';
import { Data } from '../../Sheets/Data/Data';
import { Contacts } from '../../Sheets/Contacts/Contacts';

function PageSwitch () {
  //GET SCROLL VALUE
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { scroll, zoom } = context;
  const { scrollX, scrollY } = scroll;
  const [sx, setNewScrollX] = useState(scrollX);
  const [sy, setNewScrollY] = useState(scrollY);

  useEffect(() => {
    setNewScrollX(scrollX);
    setNewScrollY(scrollY);
  }, [scrollX, scrollY]);
  switch(context?.page) {
    case "Game" :
      return Project(sx, sy, zoom);
    case "Profile" :
      return Profile(sx, sy, zoom);
    case "Data" :
      return Data(sx, sy, zoom);
    case "Contacts" :
      return Contacts(sx, sy, zoom);
    default :
      return;
  }
}

function Grid() {
  //GET SCROLL VALUE
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }

  const { scroll } = context;
  const { scrollX, scrollY } = scroll;

  const [sx, setNewScrollX] = useState(scrollX);
  const [sy, setNewScrollY] = useState(scrollY);

  useEffect(() => {
    setNewScrollX(scrollX);
    setNewScrollY(scrollY);
  }, [scrollX, scrollY]);

  //HANDLE WINDOW RESIZE
  const windowHeightRef = useRef(window.innerHeight);
  const windowWidthRef = useRef(window.innerWidth);

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

  //HANDLE COORD CHANGE
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }

  const { zoom, coords, updateCoords } = context;
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

  const components = [];
  for (let i:number = sy; (i - sy) * (80 + ((zoom - 100))/2) < windowWidthRef.current; i++) {
    for (let j:number = sx; (j - sx) * (20 + ((zoom - 100))/8) < windowHeightRef.current; j++)
    {
        const dynamicLeft = `${(i - sy) * (80 + ((zoom - 100))/2)}px`;
        const dynamicTop = `${(j - sx) * (20 + ((zoom - 100))/8)}px`;
        components.push(
          <input key={`x:${i} y:${j}`} size={1} onMouseDown={() => handleUpdateCoords(i, j)} style={{
              position: 'absolute',
              top: dynamicTop,
              left: dynamicLeft,
              width: `${80 + ((zoom - 100))/2}px`,
              height: `${20 + ((zoom - 100))/8}px`,
              boxSizing: 'border-box',
              border: '0.5px solid #C0C0C0',
              fontSize: `${10 +((zoom - 100)/16)}px`,
              textIndent: '3px',
          }}
          onFocus={(e) =>   {
            e.target.style.outline = 'none';
          }}>
          </input>)
    }
  }
  let x_square = x - sy;
  if (x === -1)
    x_square = 0;
  let y_square = y - sx;
  if (y === -1)
    y_square = 0;
  components.push(
    <div key={"highlight_cell"} style={{
        position: 'absolute',
        left: `${x_square * (80 + ((zoom - 100)/2))}px`,
        top: `${y_square * (20 + ((zoom - 100)/8))}px`,
        width: `${80 + ((zoom - 100)/2)}px`,
        height: `${20 + ((zoom - 100)/8)}px`,
        border: '1px solid #15539E',
        outline: '1px solid #15539E',
        pointerEvents:'none',
    }} />);
  if (y_square !== -1 && x_square !== -1)
    components.push(<div key={"bluesquare"} style={{position: 'relative', top: `${(y_square * (20 + (zoom - 100)/8)) + (18 + (zoom - 100)/8)}px`, left: `${((x_square * (80 + (zoom - 100)/2)) + (77 + (zoom - 100)/2))}px`, width: '5px', height: '5px', backgroundColor:'#15539E',}}></div>);

  components.push(PageSwitch());

  //HIGHLIGHT COLUMN, LINE OR EVERYTHING
  let div_width = `${(80 + ((zoom - 100)/2))}px`;
  let div_height = `${(20 + ((zoom - 100)/8))}px`;
  let div_top = `${y_square * (20 + ((zoom - 100)/8))}px`;
  let div_left = `${x_square * (80 + ((zoom - 100)/2))}px`;
  if (x === -1 && y === -1)
  {
    div_height = '100%';
    div_width = '100%';
    div_top = '0px';
    div_left = '0px';
  }
  else if (x === -1)
  {
    div_width = '100%';
    div_left = '0px';
  }
  else if (y === -1)
  {
    div_height = '100%';
    div_top = '0px';
  }
  if (x === -1 || y === -1)
    components.push(
        <div key={"highlight_column"} style={{
          position: 'absolute',
          top: div_top,
          left: div_left,
          width: div_width,
          height: div_height,
          outline: '0.5px solid #15539E',
          backgroundColor: 'rgba(21, 83, 158, 0.3)',
          pointerEvents:'none',
      }} />)

  return (
  <div>
      {components}
  </div>);
}

function useForceUpdate() {
  const [, setTick] = useState(0);
  const forceUpdate = () => {
    setTick((tick) => tick + 1);
  };
  return forceUpdate;
}

export default Grid;
