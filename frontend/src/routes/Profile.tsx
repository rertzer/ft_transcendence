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
  console.log("Token in Profile is", token);

  const { user, setUser } = useContext(UserContext);

  const [modifier, setModifier] = useState(false);

  if (user.login == "") {
    const bearer = "Bearer " + token.access_token;
    const getUser = async () => {
      const data = await fetch("http://localhost:4000/user/" + token.login, {
        method: "GET",
        headers: { Authorization: bearer },
        mode: "cors",
      });
      const user = await data.json();
      if (user.message) {
        console.log("Bad Bad");
      } else {
        setUser(user);
        console.log("User", user.login, "fetched");
      }
    };
    getUser();
  }

  useEffect(() => {}, []);

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
            <button onClick={() => setModifier(true)}>Edit profile</button>
            {modifier && <Navigate to="/edit"></Navigate>}
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
