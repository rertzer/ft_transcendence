import { FunctionComponent } from "react";
import React, { useState } from 'react';
import {useRef} from 'react';
import styless from "./Letters.module.css";
import styles from "../pages/Desktop1.module.css";

function RepeatingLetters() {
  const windowWidth = useRef(window.innerWidth);

  const components = [];
  for (let i = 0; i * 61 < windowWidth.current; i++) {
    const dynamicTop = `${(i) * 61}px`;
    let string = "";
    if (i == 0 || i == 26)
      string = "A";
    let j = i;
    if (j >= 26)
      j = j - 26;
    for (; j > 0; j = Math.floor(j / 26)) {
      string = String.fromCharCode((j%26)+65) + string;
    }
    if (i >= 26 && i < 52)
      string = "A" + string;
    components.push(
    <div style={{
        position: 'absolute',
        top: '0px',
        left: dynamicTop,
        width: '25px',
        height: '13px',
      }}>
        <div className={styless.upLetter}>{string}</div>
        <div className={styless.a} />
    </div>
    );
  }
  return (
    <div>
        {components}
    </div>
  );
}

export default RepeatingLetters;
