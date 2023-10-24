import "./Profile.scss";
import VictoryIcon from "@mui/icons-material/EmojiEventsOutlined";
import LoseIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BlockIcon from "@mui/icons-material/BlockOutlined";

import { Link, Navigate } from "react-router-dom";
import ConnectionContext from "../context/authContext";
import { useContext, useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  avatar: string;
  role: string;
  password: string;
  game_won: number;
  game_lost: number;
  game_played: number;
}

function Profile() {
  const { login, setLogin, password, setPassword } =
    useContext(ConnectionContext);
  const [user, setUser] = useState<User>();

  const fetchUser = async () => {
    const data = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ login, password }),
    });
    setUser(await data.json());
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log(user);
  let image : string = "https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg";
  if (user && user.avatar)
        image = user.avatar;

  return (
    <div className="profile">
      <div className="images">
        <img
          src={image}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">{user && (<p>{user.username}</p>)}</div>
          <div className="center">
            <span>{login}</span>
            <div className="info">
              <div className="item">
                <VictoryIcon />
                <span>Victoires: {user && user.game_won}</span>
              </div>
              <div className="item">
                <LoseIcon />
                <span>Défaites: {user && user.game_lost}</span>
              </div>
            </div>
            <button>Ajouter</button>
          </div>
          <div className="right">
            <ChatIcon />
            <BlockIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
