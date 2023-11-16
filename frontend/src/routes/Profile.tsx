import "./Profile.scss";
import VictoryIcon from "@mui/icons-material/EmojiEventsOutlined";
import LoseIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BlockIcon from "@mui/icons-material/BlockOutlined";
import { Link, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {useLogin} from "../components/user/auth";

function Profile() {
  const auth = useLogin();

  const [edit, setEdit] = useState(false);

  return (
    <div className="profile">
      <div className="images">
        <img src={auth.image} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">{auth.user && <p>{auth.user.username}</p>}</div>
          <div className="center">
            <span>{auth.user.login}</span>
            <div className="info">
              <div className="item">
                <VictoryIcon />
                <span>Victoires: {auth.user && auth.user.game_won}</span>
              </div>
              <div className="item">
                <LoseIcon />
                <span>Défaites: {auth.user && auth.user.game_lost}</span>
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
