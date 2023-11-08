import Footer from './Footer'
import Header from '../components/Header/Header';
import { Body } from '../components/Body/Body';
import { useEffect, useRef } from "react";
import styles from "./Desktop1.module.css";
import { useContext, useState } from 'react';
import { MyContext, MyProvider } from '../context/PageContext';
import ChatComponent from '../components/chat/ChatComponent';

function Desktop1() {

  //GET HEIGHT
  const windowHeighthRef = useRef(window.innerHeight);
  useEffect(() => {
  const handleResize = () => {
      windowHeighthRef.current = window.innerHeight;
      // Trigger a re-render of the component when window.innerWidth changes
      forceUpdate();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const forceUpdate = useForceUpdate();

  function DisplayChat() {
    const context = useContext(MyContext);
    if (!context) {
      throw new Error('useContext must be used within a MyProvider');
    }
    const { chat } = context;
    switch (chat) {
      case "Chat":
        return (<ChatComponent />);
      default:
        return (<div/>);
    }
  }
  const [Chat] = useState("none");
  return (
    <div className={styles.desktop1} style={{height: windowHeighthRef.current}}>
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

function useForceUpdate() {
  const [, setTick] = useState(0);
  const forceUpdate = () => {
    setTick((tick) => tick + 1);
  };
  return forceUpdate;
}