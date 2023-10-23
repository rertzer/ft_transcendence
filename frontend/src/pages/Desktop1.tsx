import { Header } from '../components/Header/Header';
import { Body } from '../components/Body/Body';
import { FunctionComponent } from "react";
import styles from "./Desktop1.module.css";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MyContext, MyProvider } from '../contexts/PageContext';

const Desktop1: FunctionComponent = () => {
  return (
    <div className={styles.desktop1}>
      <MyProvider>
        <Header     />
        <Body     />
        <footer className={styles.bottom} />
      </MyProvider>
    </div>
  );
};

export default Desktop1;

