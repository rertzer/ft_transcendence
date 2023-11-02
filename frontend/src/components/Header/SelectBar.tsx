import React, { useContext } from 'react';
import styles from "./Header.module.css"
import { SelectBarItem } from './SelectBar/SelectBarItem';

export function SelectBar({}) {
  return <div className={styles.textBar}>
          <div className={styles.textBar1} />
          <SelectBarItem labelText="Project" left="12px" />
          <SelectBarItem labelText="Data" left="72px" />
          <SelectBarItem labelText="Friends" left="132px" />
          <SelectBarItem labelText="Profile" left="192px" />
        </div>;
}