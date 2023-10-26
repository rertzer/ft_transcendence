import { useState } from 'react';
import './styles.scss';
import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './routes/Login';
import Register from './routes/Register';
import Home from './routes/Home';
import Profile from './routes/Profile';
import Navbar from './components/menus/Navbar';
import Leftbar from './components/menus/Leftbar';
import FriendsComponent from './components/friendlist/FriendsComponent';
import {  IConnected } from './context/authContext';
import ChatComponent from './components/chat/ChatComponent';
import Leaderboards from './components/leaderboards/Leaderboards';
import {IChatContext, WebsocketProvider, socket } from './context/chatContext';
import ChatContext from './context/chatContext';
import ConnectionContext from './context/authContext'
import Game from './components/game/Game';

function App() {
	const [username, setUsername] = useState('')
  const [chatId, setChatId] = useState(-1)
  const ChatContextValue: IChatContext = {
	  chatId,
	  setChatId,
  };
  const ConnectionValue: IConnected = {
	  username,
	  setUsername,
  }

  const rightBarSwitch = (state: string) => {
    switch(state) {
      case "friends" :
        return (<FriendsComponent />);
      case "chat" :
        return (<ChatComponent />);
      case "leaderboards" :
        return (<Leaderboards />);
      default :
        return;
    }
  }

  const Layout = ()=> {

    const [RightBar, setRightBar] = useState("none");
	  console.log("username", username)
    return (
    <div>
         <Navbar RightBar={RightBar} setRightBar={setRightBar}/>
         <div style={{display: "flex"}}>
           <Leftbar />
           <div style={{flex: 7}}>
             <Outlet />
           </div>
           {rightBarSwitch(RightBar)}
         </div>
    </div>
    );
  }

  const ProtectedRoute = ({children}: any) => {

    if (!username) {
      return (<Navigate to="/login" />);
    }
    return (children);
  }

  const router = createBrowserRouter([
    {
      path:"/",
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children:[
        {
          path:"/",
          element: <Home />
        },
        {
          path:"/profile/:id",
          element: <Profile />
        },
		{
			path:"/game",
			element: <Game />
		  }
      ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div >
		{/* <AuthContextProvider> */}
			<ChatContext.Provider value={ChatContextValue}>
				<ConnectionContext.Provider value={ConnectionValue}>
					<RouterProvider router={router} />
				</ConnectionContext.Provider>
			</ChatContext.Provider>
		{/* </AuthContextProvider> */}
    </div>
  );
}

export default App;
