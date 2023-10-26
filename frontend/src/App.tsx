import React, { useContext, useState } from "react";
import "./styles.scss";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/EditProfile";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import EditProfile from "./routes/EditProfile";
import Navbar from "./components/menus/Navbar";
import Leftbar from "./components/menus/Leftbar";
import FriendsComponent from "./components/friendlist/FriendsComponent";
import { IConnected } from "./context/authContext";
import { IUser, IContextUser } from "./context/userContext";
import { ChatApp } from "./Chat/chatApp";
import ChatComponent from "./components/chat/ChatComponent";
import Leaderboards from "./components/leaderboards/Leaderboards";
import { IChatContext, WebsocketProvider, socket } from "./context/chatContext";
import ChatContext from "./context/chatContext";
import ConnectionContext from "./context/authContext";
import UserContext from "./context/userContext";
import Channels from "./components/channels/Channels";

function App() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
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

  const [chatId, setChatId] = useState(-1);
  const ChatContextValue: IChatContext = {
    chatId,
    setChatId,
  };

  const ConnectionValue: IConnected = {
    login,
    setLogin,
    password,
    setPassword,
  };

  const UserValue: IContextUser = {
    user,
    setUser,
  };

  const rightBarSwitch = (state: string) => {
    switch (state) {
      case "friends":
        return <FriendsComponent />;
      case "chat":
        return <ChatComponent />;
      case "leaderboards":
        return <Leaderboards />;
      case "channels":
        return <Channels />;
      default:
        return;
    }
  };

  const Layout = () => {
    const [RightBar, setRightBar] = useState("none");
    console.log("login", login);
    return (
      <div>
        <Navbar RightBar={RightBar} setRightBar={setRightBar} />
        <div style={{ display: "flex" }}>
          <Leftbar />
          <div style={{ flex: 7 }}>
            <Outlet />
          </div>
          {rightBarSwitch(RightBar)}
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }: any) => {
    if (!login) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/profile/edit",
          element: <EditProfile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <div>
      <UserContext.Provider value={UserValue}>
        <ChatContext.Provider value={ChatContextValue}>
          <ConnectionContext.Provider value={ConnectionValue}>
            <RouterProvider router={router} />
          </ConnectionContext.Provider>
        </ChatContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
