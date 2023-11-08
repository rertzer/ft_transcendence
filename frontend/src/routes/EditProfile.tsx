import "./EditProfile.scss";
import { Link, Navigate } from "react-router-dom";
import UserContext, { IUser } from "../context/userContext";
import { useContext, useEffect, useState, MouseEvent } from "react";

import StringField from "../components/user/StringField";
import PassField from "../components/user/PassField";
import { Email } from "@mui/icons-material";
import EmailField from "../components/user/EmailField";

interface IToSend {
  login: string;
  username?: string;
  password?: string;
  email?: string;
  avatar?: string;
}

function Register() {
  const { user, setUser } = useContext(UserContext);

  let tmp = user.username;
  if (tmp == null) tmp = "";

  const [login, setLogin] = useState("");
  const [userOk, setUserOk] = useState(false);
  const [newUsername, setNewUsername] = useState(tmp);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user.email);
  const [newAvatar, setNewAvatar] = useState<File>();
  const [avatarName, setAvatarName] = useState("");

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    const avatar = selectedFiles?.[0];
    if (avatar) {
      setNewAvatar(avatar);
      setAvatarName(avatar.name);
    }
  };

  const handleUser = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("Editing the user");

    const raw_token: string | null = sessionStorage.getItem("Token");
    let token = { login: "", access_token: "" };
    if (raw_token) token = JSON.parse(raw_token);
    console.log("Token in EditProfile is", token);
    const bearer = "Bearer " + token.access_token;
    if (newAvatar) {
      console.log("new Avatar");
      let formData = new FormData();
      formData.append("file", newAvatar, newAvatar.name);
      console.log(formData);

      const fileData = await fetch("/auth/editAvatar", {
        method: "POST",
        headers: { Authorization: bearer },
        body: formData,
      });
      const answer = await fileData.json();
      console.log("Answer", JSON.stringify(answer));
      setUserOk(true);
    }

    let tosend: IToSend = { login: user.login };
    if (newUsername) tosend.username = newUsername;
    if (newPassword) tosend.password = newPassword;
    if (newEmail) tosend.email = newEmail;

    console.log("fetching", tosend);
    const data = await fetch("/auth/edit", {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(tosend),
    });
    const newUser = await data.json();
    console.log("nouveau", newUser);

    if (newUser) {
      if (newUser.message) {
        console.log("Bad request");
        setNewPassword("");

        setUserOk(false);
      } else {
        setUser(newUser);
        setUserOk(true);
        console.log("Edited!!!", userOk);
      }
    }
  };

  useEffect(() => {
    let stored_login: string | null = sessionStorage.getItem("Login");
    if (stored_login != null) setLogin(stored_login);
  }, []);

  useEffect(() => {
    if (!newUsername && user.username) setNewUsername(user.username);
  }, [user.username]);

  return (
    <div className="register">
      <div className="card">
        <div className="right">
          <h1>Edit profile</h1>
          <h2>{user.login}</h2>
          <form>
            <StringField
              placeholder="username"
              value={newUsername}
              onChange={setNewUsername}
            />
            <PassField value={newPassword} handleValid={setNewPassword} />
            <EmailField value={newEmail} handleValid={setNewEmail} />
            <input
              type="file"
              onChange={(e) => {
                handleAvatar(e);
              }}
            />
            {userOk && <Navigate to="/profile"></Navigate>}
            <button onClick={handleUser}>Edit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
