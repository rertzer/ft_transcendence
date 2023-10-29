import Header from '../components/Header/Header';
import { Body } from '../components/Body/Body';
import { FunctionComponent } from "react";
import styles from "./Desktop1.module.css";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MyContext, MyProvider } from '../context/PageContext';
import ChatComponent from '../components/chat/ChatComponent';

function Desktop1() {
  return (
    <div className={styles.desktop1}>
      <MyProvider>
        <Header />
        <Body />
        <footer className={styles.bottom} />
        {<ChatComponent />}
      </MyProvider>
    </div>
  );
}

export default Desktop1;

