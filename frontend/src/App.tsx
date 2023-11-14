import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./routes/Login";
import EditProfile from "./routes/EditProfile";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Twofa from "./routes/TwoFA";
import Navbar from "./components/menus/Navbar";
import Leftbar from "./components/menus/Leftbar";
import FriendsComponent from "./components/friendlist/FriendsComponent";
import { IUser, IContextUser } from "./context/userContext";
import { ChatApp } from "./Chat/chatApp";
import ChatComponent from "./components/chat/ChatComponent";
import Leaderboards from "./components/leaderboards/Leaderboards";
import { IChatContext, WebsocketProvider, socket } from "./context/chatContext";
import ChatContext from "./context/chatContext";
import UserContext from "./context/userContext";
import Channels from "./components/channels/Channels";


function App() {
  const raw_token: string | null = sessionStorage.getItem("Token");
  let token = { login: "", access_token: "" };
  if (raw_token) token = JSON.parse(raw_token);

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

  const [chatId, setChatId] = useState(-1);
  const ChatContextValue: IChatContext = {
    chatId,
    setChatId,
  };

  const UserValue: IContextUser = {
    user,
    setUser,
    image,
    setImage,
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
    if (!token.login) {
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
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/edit",
          element: <EditProfile />,
        },
        {
          path: "/twofa",
          element: <Twofa />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

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
    <div>
      <UserContext.Provider value={UserValue}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </div>
  );
}

export default App;
