import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header';
import { Body } from '../components/Body/Body';
import { useEffect, useRef } from "react";
import styles from "./Desktop1.module.css";
import { useContext, useState } from 'react';
import { PageContext } from '../context/PageContext';
import ChatComponent from '../components/chat/ChatComponent';
import { WebsocketContext } from "../context/chatContext";
import { useLogin } from "../components/user/auth";
import { gameSocket } from '../components/game/services/gameSocketService';
import { GameStatus } from '../context/gameContext';
import GameContext, { IGameContextProps } from '../context/gameContext';
import { useLocation } from 'react-router-dom';

function Desktop1() {

	const auth = useLogin();
	const [roomId, setRoomId] = useState(0);
	const [playerName, setPlayerName] = useState('');
	const [gameWidth, setGameWidth] = useState(0);
	const [gameHeight, setGameHeight] = useState(0);
	const [modeGame, setModeGame] = useState('');
	const [gameStatus, setGameStatus] = useState<GameStatus>('NOT_IN_GAME');

	useEffect(() => {
		gameSocket.connect();
		console.log('artsghrdnhytenteynwtyegnt', auth)
		return (()=> {
			gameSocket.disconnect();
		})
	}, []);

	useEffect(() => {
	  console.log("rkeklkrer");
	  socket.connect();
	  
	  return (()=>{
		socket.disconnect();
	  })
	}, []);

	useEffect(() => {
		if (auth.user.login) {
			setPlayerName(auth.user.login);
			socket.emit("newChatConnection", auth.user.login);
		}
	},[auth.user.login])

	const gameContextValue :IGameContextProps = {
		roomId,
		setRoomId,
		gameWidth,
		setGameWidth,
		gameHeight,
		setGameHeight,
		playerName,
		setPlayerName, 
		modeGame,
		setModeGame, 
		gameStatus,
		setGameStatus
	};

  //GET HEIGHT
  const socket = useContext(WebsocketContext);
 
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


	// useEffect(() => {
	// 	console.log("C", auth.user);
	// 	console.log("yo send something pls : " , socket.id);
	// },[auth.user.login]);

  const forceUpdate = useForceUpdate();

  function DisplayChat() {
    const context = useContext(PageContext);
    if (!context) {
      throw new Error('useContext must be used within a MyProvider');
    }
    const { chat, updatePage } = context;
	const { roomId } = useContext(GameContext);

	useEffect(() => {
		if (roomId !== 0)
			updatePage("Game");
	}, [roomId]);
	
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
		<GameContext.Provider value={gameContextValue}>
			<Body />
			<Header />
			<Footer/>
			<DisplayChat />
		</GameContext.Provider>
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
