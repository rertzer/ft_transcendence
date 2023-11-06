import Footer from './Footer'
import Header from '../components/Header/Header';
import { Body } from '../components/Body/Body';
import { FunctionComponent } from "react";
import styles from "./Desktop1.module.css";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MyContext, MyProvider } from '../context/PageContext';
import ChatComponent from '../components/chat/ChatComponent';

function Desktop1() {
  function DisplayChat() {
    const context = useContext(MyContext);
    if (!context) {
      throw new Error('useContext must be used within a MyProvider');
    }
    const { chat, updateChat } = context;
    switch (chat) {
      case "Chat":
        return (<ChatComponent />);
      default:
        return (<div/>);
    }
  }
  const [Chat, setChat] = useState("none");
  return (
    <div className={styles.desktop1}>
      <MyProvider>
        <Body />
        <Header />
        <Footer/>
        <DisplayChat />
      </MyProvider>
    </div>
  );
}

export default Desktop1;

