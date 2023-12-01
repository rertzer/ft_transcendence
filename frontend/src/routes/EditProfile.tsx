import "./EditProfile.scss";
import { Link, Navigate } from "react-router-dom";
import { useLogin } from "../components/user/auth";
import { useContext, useEffect, useState, MouseEvent } from "react";

import StringField from "../components/user/StringField";
import PassField from "../components/user/PassField";
import { Email } from "@mui/icons-material";
import EmailField from "../components/user/EmailField";

interface IToSend {
  login: string;
  username?: string;
  email?: string;
  avatar?: string;
}

function EditProfile() {
  const auth = useLogin();

  let tmp = auth.user.username;
  if (tmp == null) tmp = "";

  const [login, setLogin] = useState("");
  const [userOk, setUserOk] = useState(false);
  const [newUsername, setNewUsername] = useState(tmp);
  const [newEmail, setNewEmail] = useState(auth.user.email);
  const [newAvatar, setNewAvatar] = useState<File>();
  const [avatarName, setAvatarName] = useState("");
  const [returnPath, setReturnPath] = useState("/");

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    const avatar = selectedFiles?.[0];
    if (avatar) {
      setNewAvatar(avatar);
      setAvatarName(avatar.name);
    }
    else{
      setNewAvatar(undefined);
      setAvatarName("");
    }
  };

  const handleUser = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("Editing the user");

    console.log("Token in EditProfile is", auth.getBearer());

    if (newAvatar) {
      try{
      console.log("new Avatar", newAvatar);
      let formData = new FormData();
      formData.append("file", newAvatar, newAvatar.name);
      console.log("newAvatar", formData.keys, newAvatar.name);

      const fileData = await fetch(
        `http://${process.env.REACT_APP_URL_MACHINE}:4000/user/editAvatar`,
        {
          method: "POST",
          headers: { Authorization: auth.getBearer() },
          body: formData,
        }
      );
      const answer = await fileData.json();
      console.log("Answer", JSON.stringify(answer));
      setUserOk(true);
      }
        catch(e) {console.log(e);}
    }

    let tosend: IToSend = { login: auth.user.login };
    if (newUsername) tosend.username = newUsername;
    if (newEmail) tosend.email = newEmail;

    if (tosend.username || tosend.email){
    try{
    console.log("fetching", tosend);
    const data = await fetch(
      `http://${process.env.REACT_APP_URL_MACHINE}:4000/user/edit`,
      {
        method: "POST",
        headers: {
          Authorization: auth.getBearer(),
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(tosend),
      }
    );
    const newUser = await data.json();
    console.log("nouveau", newUser);

    if (newUser) {
      if (newUser.message) {
        console.log("Bad request");

        setUserOk(false);
      } else {
        if (auth.user.newbie) setReturnPath("/twofa");
        auth.edit(newUser);
        setUserOk(true);
        console.log("Edited!!!", userOk);
      }
    }
  }
  catch(e) {console.log(e);}}
  };

  useEffect(() => {
    let stored_login: string | null = sessionStorage.getItem("Login");
    if (stored_login != null) setLogin(stored_login);
  }, []);

  useEffect(() => {
    if (!newUsername && auth.user.username) setNewUsername(auth.user.username);
  }, [auth.user.username]);

  return (
    <div className="register">
      <div className="card">
        <div className="right">
          <h1>Edit profile</h1>
          <h2>{auth.user.login}</h2>
          {auth.user.newbie && (
            <div>
              <h3> Welcome to PongOffice</h3>
              <h3>please setup your profile</h3>
            </div>
          )}
          <form>
            <StringField
              placeholder="username"
              value={newUsername}
              onChange={setNewUsername}
            />
            <EmailField value={newEmail} handleValid={setNewEmail} />
            <input
              type="file"
              onChange={(e) => {
                handleAvatar(e);
              }}
            />

            {userOk && <Navigate to={returnPath}></Navigate>}
            <button onClick={handleUser}>Edit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
