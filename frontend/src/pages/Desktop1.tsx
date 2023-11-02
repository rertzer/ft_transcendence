import Footer from './Footer'
import Header from '../components/Header/Header';
import { Body } from '../components/Body/Body';
import { FunctionComponent } from "react";
import styles from "./Desktop1.module.css";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MyContext, MyProvider } from '../context/PageContext';
import ChatComponent from '../components/chat/ChatComponent';

const displayChat = (state: string) => {
  switch(state) {
    case "Chat" :
      return (<ChatComponent />);
    default :
      return;
  }
}

function Desktop1() {
  const [Chat, setChat] = useState("none");
  return (
    <div className={styles.desktop1}>
      <MyProvider>
        <Body />
        <Header />
        { Footer (Chat, setChat)}
        { displayChat(Chat) }
      </MyProvider>
    </div>
  );
}

export default Desktop1;

