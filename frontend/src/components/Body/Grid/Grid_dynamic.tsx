import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { MyContext } from '../../../context/PageContext';

// //GET SCROLL VALUE
// const context = useContext(MyContext);
// if (!context) {
//   throw new Error('useContext must be used within a MyProvider');
// }

// const { scroll, updateScroll } = context;
// const { scrollX, scrollY } = scroll;

// const [sx, setNewScrollX] = useState(scrollX);
// const [sy, setNewScrollY] = useState(scrollY);
  
// useEffect(() => {
//   setNewScrollX(scrollX);
//   setNewScrollY(scrollY);
// }, [scrollX, scrollY]);

function CreateCell (coordX : number, coordY : number, width : number, height : number, text : string, border: string, sx : number, sy : number) {
  return (<div key={`x:${coordX} y:${coordY}${text}${border}`} style={{
      position: 'absolute',
      top: `${20 * (coordX - sx)}px`,
      left: `${0 + 80 * (coordY - sy)}px`,
      width: `${80 * width}px`,
      height: `${20 * height}px`,
      color: `black`,
      font: '10px',
      backgroundColor: 'lightGrey',
      border: border,
      textAlign: 'center',
    }}>{text}</div>);
}

function Project (sx : number, sy : number) {
  return (
    <div key={"project"}>
      {CreateCell(1, 1, 2, 1, "Points", "2px solid black", sx, sy)}
      {CreateCell(2, 1, 1, 1, "User1", "1px solid black", sx, sy)}
      {CreateCell(2, 2, 1, 1, "User2", "1px solid black", sx, sy)}
      {CreateCell(3, 1, 1, 1, "1", "1px solid black", sx, sy)}
      {CreateCell(3, 2, 1, 1, "4", "1px solid black", sx, sy)}
      {CreateCell(3, 100, 1, 1, "4", "1px solid black", sx, sy)}
    </div>);
}

function Profile (sx : number, sy : number) {
  return (
    <div key={"project"}>
      {CreateCell(2, 1, 1, 1, "User1", "1px solid black", sx, sy)}
      {CreateCell(2, 2, 1, 1, "User2", "1px solid black", sx, sy)}
      {CreateCell(3, 1, 1, 1, "1", "1px solid black", sx, sy)}
      {CreateCell(3, 2, 1, 1, "4", "1px solid black", sx, sy)}
      {CreateCell(3, 100, 1, 1, "4", "1px solid black", sx, sy)}
    </div>);
}

function Data (sx : number, sy : number) {
  return (
    <div key={"data"}>
      {CreateCell(1, 1, 4, 1, "Statistics", "2px solid black", sx, sy)}
      {CreateCell(3, 1, 1, 1, "Wins", "1px solid black", sx, sy)}
      {CreateCell(4, 1, 1, 1, "150", "1px solid black", sx, sy)}
      {CreateCell(3, 2, 1, 1, "Looses", "1px solid black", sx, sy)}
      {CreateCell(4, 2, 1, 1, "4", "1px solid black", sx, sy)}
      {CreateCell(3, 4, 1, 1, "Classement", "1px solid black", sx, sy)}
      {CreateCell(4, 4, 1, 1, "18000e", "1px solid black", sx, sy)}
    </div>);
}

function Contacts (sx : number, sy : number) {
  return (
    <div key={"contacts"}>
      {CreateCell(1, 1, 3, 1, "Amis", "1px solid black", sx, sy)}
      {CreateCell(2, 1, 1, 1, "Richard", "0.5px solid black", sx, sy)}
      {CreateCell(2, 2, 1, 1, "Block", "0.5px solid red", sx, sy)}
      {CreateCell(2, 3, 1, 1, "Message", "0.5px solid green", sx, sy)}
      {CreateCell(3, 1, 1, 1, "Patrick", "0.5px solid black", sx, sy)}
      {CreateCell(3, 2, 1, 1, "Block", "0.5px solid red", sx, sy)}
      {CreateCell(3, 3, 1, 1, "Message", "0.5px solid green", sx, sy)}
    </div>);
}

function BarSwitch () {
    //GET SCROLL VALUE
    const context = useContext(MyContext);
    if (!context) {
      throw new Error('useContext must be used within a MyProvider');
    }
  
    const { scroll, updateScroll } = context;
    const { scrollX, scrollY } = scroll;
  
    const [sx, setNewScrollX] = useState(scrollX);
    const [sy, setNewScrollY] = useState(scrollY);
      
    useEffect(() => {
      setNewScrollX(scrollX);
      setNewScrollY(scrollY);
    }, [scrollX, scrollY]);
  switch(context?.page) {
    case "Project" :
      return Project(sx, sy);
    case "Profile" :
      return Profile(sx, sy);
    case "Data" :
      return Data(sx, sy);
    case "Contacts" :
      return Contacts(sx, sy);
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

  const { scroll, updateScroll } = context;
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

  const components = [];
  for (let i:number = sy; (i - sy) * 80 < windowWidthRef.current; i++) {
    for (let j:number = sx; (j - sx) * 16 < windowHeightRef.current; j++)
    {
        const dynamicLeft = `${(i - sy) * 80}px`;
        const dynamicTop = `${(j - sx) * 20}px`;
        components.push(
          <input key={`x:${i} y:${j}`} size={1} onMouseDown={() => handleUpdateCoords(i, j)} style={{
              position: 'absolute',
              top: dynamicTop,
              left: dynamicLeft,
              width: '80px',
              height: '20px',
              boxSizing: 'border-box',
              border: '0.5px solid #C0C0C0',
              fontSize: '10px',
              textIndent: '3px',
          }}
          onFocus={(e) =>   {
            e.target.style.outline = 'none';
          }}>
          </input>)
    }
  }
  let x_square = x - sy;
  if (x == -1)
    x_square = 0;
  let y_square = y - sx;
  if (y == -1)
    y_square = 0;
  components.push(
    <div key={"highlight_cell"} style={{
        position: 'absolute',
        top: `${y_square * 20}px`,
        left: `${x_square * 80}px`,
        width: '80px',
        height: '20px',
        border: '1px solid #15539E',
        outline: '1px solid #15539E',
        pointerEvents:'none',
    }} />);
  if (y_square != -1 && x_square != -1)
    components.push(<div key={"bluesquare"} style={{position: 'relative', top: `${y_square * 20 + 18}px`, left: `${x_square * 80 + 77}px`, width: '5px', height: '5px', backgroundColor:'#15539E',}}></div>);
  
  components.push(BarSwitch());

  //HIGHLIGHT COLUMN, LINE OR EVERYTHING
  let div_width = '80px';
  let div_height = '20px';
  let div_top = `${y_square * 20}px`;
  let div_left = `${x_square * 80}px`;
  if (x == -1 && y == -1)
  {
    div_height = '100%';
    div_width = '100%';
    div_top = '0px';
    div_left = '0px';
  }
  else if (x == -1)
  {
    div_width = '100%';
    div_left = '0px';
  }
  else if (y == -1)
  {
    div_height = '100%';
    div_top = '0px';
  }
  if (x == -1 || y == -1)
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