import "./EditProfile.scss";
import { Link, Navigate } from "react-router-dom";
import UserContext, { IUser } from "../context/userContext";
import { useContext, useEffect, useState, MouseEvent } from "react";

interface IToSend {
  login: string;
  username?: string;
  password?: string;
  email?: string;
  avatar?: string;
}

function Register() {
  const { user, setUser } = useContext(UserContext);
  const [login, setLogin] = useState("");
  const [userOk, setUserOk] = useState(false);
  const [newUsername, setnewUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user.email);
  const [confPasswordClass, setConfPasswordClass] = useState("NA");
  const [newAvatar, setNewAvatar] = useState<File>();
  const [avatarName, setAvatarName] = useState("");

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    const avatar = selectedFiles?.[0];
    if (avatar) {
      console.log("avatar is", avatar, " __ ", avatar.name);
      setNewAvatar(avatar);
      setAvatarName(avatar.name);
      console.log("avatar found 1", avatarName);
    }
  };

  const handleUser = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("Editing the user");
    if (confPasswordClass !== "KO") {
      //let newUser: IUser | undefined;

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

        const fileData = await fetch("http://localhost:4000/auth/editAvatar", {
          method: "POST",
          mode: "cors",
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
      const data = await fetch("http://localhost:4000/auth/edit", {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: bearer,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(tosend),
      });
      const newUser = await data.json();
      console.log("nouveau", newUser);

      if (newUser && newUser.message) {
        console.log("Bad request");
        setNewPassword("");
        setConfPassword("");
        setConfPasswordClass("NA");
        setUserOk(false);
      } else console.log("before", user.username, userOk);

      if (newUser) {
        setUser(newUser);
        setUserOk(true);
        console.log("Edited!!!", userOk);
      }
    } else console.log("BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD");
  };

  useEffect(() => {
    let stored_login: string | null = sessionStorage.getItem("Login");
    if (stored_login != null) setLogin(stored_login);
  }, []);

  useEffect(() => {
    console.log("useEffect");
    if (confPassword && newPassword) {
      if (confPassword === newPassword) setConfPasswordClass("OK");
      else setConfPasswordClass("KO");
    } else setConfPasswordClass("NA");
  }, [confPassword, newPassword]);

  useEffect(() => {
    console.log("useEffect", avatarName, "file");
    console.log("edit ok in Effect is", userOk);
  }, [avatarName]);

  console.log("edit ok is", userOk);
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Pong.</h1>
          <p>
            Salut, ici on joue a pong. Tu connais pas? C'est un jeu de tennis en
            gros.
          </p>
          <span>Ton avatar ne te plait pas ? Ben change.</span>
        </div>
        <div className="right">
          <h1>Edit profile</h1>
          <h2>{user.login}</h2>
          <form>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setnewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className={confPasswordClass}
              type="password"
              placeholder="Confirm Password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="E-mail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="file"
              onChange={(e) => {
                handleAvatar(e);
              }}
            />
            <h2>
              {user.username} {userOk}
            </h2>

            {userOk && <Navigate to="/profile"></Navigate>}
            <button onClick={handleUser}>Edit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
