import styles from "./SelectBarItem.module.css"
import React, { useContext } from 'react';
import { MyContext } from '../../../context/PageContext';

interface SelectBarProps {
  labelText: string;
  left: string;
}

export function SelectBarItem( { labelText, left}  : SelectBarProps) {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { page, updatePage } = context;
  const handleUpdate = () => {
    updatePage(labelText);
  };

  const divStyle = {
    left: left,
  };
  return (<div className={styles.file} style={divStyle} onMouseDown={handleUpdate}>
            <div className={styles.file1}>{labelText}</div>
          </div>);
}
  

 // function AnotherComponent() {

//     const { data, updateData } = context;
//     const handleUpdate = () => {
//       updateData('Updated shared data');
//     };
//     return (
//       <div>
//         <p>{data}</p>
//         <button onClick={handleUpdate}>Update Data</button>
//       </div>
//     );
//   }
//   export default AnotherComponent;import React, { useContext } from 'react';
  //   export default AnotherComponent;