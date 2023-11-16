import React from 'react';
import "./Cells.css";

type CreateCellProps = {
  coordX: number;
  coordY: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  scroll_x: number;
  scroll_y: number;
  zoom: number;
  className?: string;
};

export function CreateStyledCell({
  coordX, coordY, width, height, text, fontSize, scroll_x, scroll_y, zoom, className, // Accept a className as a prop
}: CreateCellProps) {
  return (
    <div
      key={`x:${coordX} y:${coordY}${text}${className}`}
      style={{
        position: 'absolute',
        top: `${(20 + (zoom - 100) / 8) * (coordX - scroll_x)}px`,
        left: `${0 + (80 + (zoom - 100) / 2) * (coordY - scroll_y)}px`,
        width: `${(80 + (zoom - 100) / 2) * width}px`,
        height: `${(20 + (zoom - 100) / 8) * height}px`,
        fontSize: `${fontSize + ((zoom - 100) / 16)}px`,
      }}
      className={`cell ${className}`}
    >
      {text}
    </div>
  );
}
