import React from 'react';
import { CreateStyledCell } from '../CreateStyledCell';

function alternateLine(sx: number, sy: number, zoom: number)
{
  const lines = [];
  for (let i = 0; i < 100; i++)
  {
    if (i % 2 === 0)
      lines.push(
        <CreateStyledCell 
          coordX={3 + i} coordY={1} width={5} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
          text={''} fontSize={0} className={"linePair"} />);
    else
      lines.push(<CreateStyledCell 
        coordX={3 + i} coordY={1} width={5} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
        text={''} fontSize={0} className={"lineUnpair"} />)
  }
  return (<div>{lines}</div>);
}

export function Contacts(sx: number, sy: number, zoom: number) {
  return (
    <div key={"contact"}>
      <CreateStyledCell 
        coordX={1} coordY={1} width={5} height={2} scroll_x={sx} scroll_y={sy} zoom={zoom}
        text={'Contact'} fontSize={14} className={"title"} />
      {alternateLine(sx, sy, zoom)}

      <CreateStyledCell 
        coordX={3} coordY={1} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
        text={'jlanza'} fontSize={12} className={"text"} />
      <CreateStyledCell 
      coordX={3} coordY={3} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
      text={'invite'} fontSize={12} className={"invite"} />
      <CreateStyledCell 
      coordX={3} coordY={4} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
      text={'message'} fontSize={12} className={"message"} />
      <CreateStyledCell 
      coordX={3} coordY={5} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
      text={'block'} fontSize={12} className={"block"} />

      <CreateStyledCell 
        coordX={4} coordY={1} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
        text={'mbockel'} fontSize={12} className={"text"} />
      <CreateStyledCell 
      coordX={4} coordY={3} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
      text={'invite'} fontSize={12} className={"invite"} />
      <CreateStyledCell 
      coordX={4} coordY={4} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
      text={'message'} fontSize={12} className={"message"} />
      <CreateStyledCell 
      coordX={4} coordY={5} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
      text={'block'} fontSize={12} className={"block"} />
      
      <CreateStyledCell 
        coordX={1} coordY={1} width={5} height={102} scroll_x={sx} scroll_y={sy} zoom={zoom}
        text={''} fontSize={0} className={"background"} />
    </div>);
}
