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
  const { login, setLogin, password, setPassword } =
    useContext(ConnectionContext);
  const { user, setUser } = useContext(UserContext);

  const [modifier, setModifier] = useState(false);

 

  useEffect(() => {
    /*fetchUser();*/
  }, []);

  console.log(user);
  let image: string =
    "https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg";
  if (user && user.avatar) image = user.avatar;

  return (
    <div className="profile">
      <div className="images">
        <img src={image} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">{user && <p>{user.username}</p>}</div>
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
            <button onClick={() => setModifier(true)}>Edit profile</button>
            {modifier && <Navigate to="/profile/edit"></Navigate>}
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
