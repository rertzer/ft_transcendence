import React, { useContext, useState, useEffect } from 'react';
import './styles.scss';
import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './routes/Login';
import Profile from './routes/Profile';
import {  IConnected } from './context/authContext';
import ChatComponent from './components/chat/ChatComponent';
import {IChatContext, WebsocketProvider, socket } from './context/chatContext';
import ChatContext from './context/chatContext';
// import { AuthContextProvider } from './context/authContext';
import { WebsocketContext } from './context/chatContext';
import UserContext from './context/userContext'
import { IContextUser } from './context/userContext';
import Desktop1 from './pages/Desktop1';
import Game from './components/game/Game';

function App() {
  const raw_token: string | null = sessionStorage.getItem("Token");
  let token = { login: "", access_token: "" };
  if (raw_token) token = JSON.parse(raw_token);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
	console.log("rkeklkrer");
	socket.connect();
    }, []);

  const [user, setUser] = useState({
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    login: "",
    email: "",
    avatar: "",
    role: "",
    password: "",
    game_won: 0,
    game_lost: 0,
    game_played: 0,
  });

  const [image, setImage] = useState(
    "https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg"
  );
  const bearer = "Bearer " + token.access_token;

  if (token.login && user.login == "") {

    const getUser = async () => {
      const data = await fetch("/user/" + token.login, {
        method: "GET",
        headers: { Authorization: bearer },
      });
      const user = await data.json();
      if (user.message) {
        console.log("Bad Bad");
      } else {
        setUser(user);
      }
    };
    try {
      getUser();
    } catch (e) {
      console.log(e);
    }
  }

  const fetchImage = async () => {
    const res = await fetch("/user/avatar/" + user.avatar, {
      method: "GET",
      headers: { Authorization: bearer },
    });
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImage(imageObjectURL);
  };


  const UserValue: IContextUser = {
    user,
    setUser,
    image,
    setImage,
  };

  const ProtectedRoute = ({ children }: any) => {
    if (!token.login) {
      return <Navigate to="/login" />;
    }
    return children;
  };


  const router = createBrowserRouter([
    {
      path:"/",
      element: <ProtectedRoute><Desktop1 /></ProtectedRoute>,
      children:[
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

  ]);
  const [chatId, setChatId] = useState(-1)
  const ChatContextValue: IChatContext = {
	  chatId,
	  setChatId,
  };

  useEffect(() => {
    if (user.avatar !== null && user.avatar !== "") {
      try {
        fetchImage().catch((e) => console.log("Failed to fetch the avatar"));
      } catch (e) {
        console.log(e);
      }
    }
  }, [user]);


  return (
    <div >
		{/* <AuthContextProvider> */}
				<UserContext.Provider value={UserValue}>
					<RouterProvider router={router} />
				</UserContext.Provider>
		{/* </AuthContextProvider> */}
    </div>
  );
}

export default App;
