import "./Profile.scss";
import VictoryIcon from "@mui/icons-material/EmojiEventsOutlined";
import LoseIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BlockIcon from "@mui/icons-material/BlockOutlined";
import { IUser, IContextUser } from "../context/userContext";
import { Link, Navigate } from "react-router-dom";
import ConnectionContext from "../context/authContext";
import UserContext from "../context/userContext";
import { useContext, useEffect, useState } from "react";

function Profile() {
  const raw_token: string | null = sessionStorage.getItem("Token");
  let token = { login: "", access_token: "" };
  if (raw_token) token = JSON.parse(raw_token);

  const { user, setUser, image, setImage } = useContext(UserContext);
  const [edit, setEdit] = useState(false);

  return (
    <div className="profile">
      <div className="images">
        <img src={image} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">{user && <p>{user.username}</p>}</div>
          <div className="center">
            <span>{user.login}</span>
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
            <button onClick={() => setEdit(true)}>Edit profile</button>
            {edit && <Navigate to="/edit"></Navigate>}
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
