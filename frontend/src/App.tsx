import { useState } from 'react';
import './styles.scss';
import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './routes/Login';
import Register from './routes/Register';
import Home from './routes/Home';
import Profile from './routes/Profile';
import {  IConnected } from './context/authContext';
import ChatComponent from './components/chat/ChatComponent';
import { IChatContext } from './context/chatContext';
import ChatContext from './context/chatContext';
import ConnectionContext from './context/authContext'
import Game from './components/game/Game';
import Desktop1 from './pages/Desktop1';

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

  const ProtectedRoute = ({children}: any) => {

    if (!username) {
      return (<Navigate to="/login" />);
    }
    return (children);
  }

  const router = createBrowserRouter([
    {
      path:"/",
      element: <ProtectedRoute><Desktop1 /></ProtectedRoute>,
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
    <div>
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
