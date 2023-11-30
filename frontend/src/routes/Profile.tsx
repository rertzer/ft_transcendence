import "./Profile.scss";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BlockIcon from "@mui/icons-material/BlockOutlined";
import { Navigate } from "react-router-dom";
import { useState } from "react";
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
