import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header';
import { Body } from '../components/Body/Body';
import { useEffect, useRef } from "react";
import styles from "./Desktop1.module.css";
import { useContext, useState } from 'react';
import { MyContext, MyProvider } from '../context/PageContext';
import ChatComponent from '../components/chat/ChatComponent';
import { WebsocketContext } from "../context/chatContext";
import { useLogin } from "../components/user/auth";

function Desktop1() {

  //GET HEIGHT
  const socket = useContext(WebsocketContext);
  const auth = useLogin();
  const windowHeighthRef = useRef(window.innerHeight);
  console.log("A", auth.user);
  
  useEffect(() => {
  const handleResize = () => {
	console.log("B", auth.user);
      windowHeighthRef.current = window.innerHeight;
      // Trigger a re-render of the component when window.innerWidth changes
      //forceUpdate();
    };
    window.addEventListener('resize', handleResize);
    return () => {
		window.removeEventListener('resize', handleResize);
    };
}, []);

//   useEffect(() => {
	// 	console.log("user send = ", user.login);
	// 	console.log("rkeklkrer");
	// 	socket.connect();
	//     }, []);

	useEffect(() => {
		console.log("C", auth.user);
		if (auth.user.login)
			socket.emit("newChatConnection", auth.user.login);
		console.log("yo send something pls : " , socket.id);
	},[auth.user]);

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
