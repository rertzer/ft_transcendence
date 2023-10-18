import React, { useState } from 'react';
import styless from "./Numbers.module.css";
import styles from "../global.css";

function RepeatingComponent() {
  const [count, setCount] = useState(1000);

  const repeatComponent = () => {
    setCount(count + 1);
  };

  const components = [];
  for (let i = 1; i < count; i++) {
    const dynamicTop = `${(i) * 13 - 13}px`;
    components.push(
    <div style={{
        position: 'absolute',
        top: dynamicTop,
        left: '0px',
        width: '25px',
        height: '13px',
      }}>
        <div className={styless.numberGroupChild} />
        <div className={styless.numbers}>{i}</div>
    </div>
    );
  }

  return (
    <div>
        {components}
    </div>
    // <div>
    //   <button onClick={repeatComponent}>Add Another</button>
    //   <div className="container">{components}</div>
    // </div>
  );
}

export default RepeatingComponent;
