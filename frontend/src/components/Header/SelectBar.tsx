import React, { useContext } from 'react';
import styles from "./Header.module.css"
import { SelectBarItem } from './SelectBar/SelectBarItem';

export function SelectBar({}) {
  return <div className={styles.textBar}>
          <div className={styles.textBar1} />
          <SelectBarItem labelText="Project" left="0px" />
          <SelectBarItem labelText="Data" left="45px" />
          <SelectBarItem labelText="Friends" left="90px" />
          <SelectBarItem labelText="Chat" left="135px" />
        </div>;
}