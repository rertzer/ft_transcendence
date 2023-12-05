import "./EditProfile.scss";
import { Navigate } from "react-router-dom";
import { useLogin } from "../components/user/auth";
import { useEffect, useState, MouseEvent } from "react";

import StringField from "../components/user/StringField";
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
  if (tmp === null) tmp = "";

  const [userOk, setUserOk] = useState(false);
  const [newUsername, setNewUsername] = useState(tmp);
  const [newEmail, setNewEmail] = useState(auth.user.email);
  const [newAvatar, setNewAvatar] = useState<File>();
  const [returnPath, setReturnPath] = useState("/");

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    const avatar = selectedFiles?.[0];
    if (avatar) {
      setNewAvatar(avatar);
    }
    else{
      setNewAvatar(undefined);
    }
  };

  const handleUser = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (newAvatar) {
      try {
      let formData = new FormData();
      formData.append("file", newAvatar, newAvatar.name);
      const fileData = await fetch(
        `http://${process.env.REACT_APP_URL_MACHINE}:4000/user/editAvatar`,
        {
          method: "POST",
          headers: { Authorization: auth.getBearer() },
          body: formData,
        }
      );
      await fileData.json();
      setUserOk(true);
      }
        catch(e) {console.error(e);}
    }

    let tosend: IToSend = { login: auth.user.login };
    if (newUsername) tosend.username = newUsername;
    if (newEmail) tosend.email = newEmail;

    if (tosend.username || tosend.email){
    try{
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

    if (newUser) {
      if (newUser.message) {
        console.log(newUser.message)
        setUserOk(false);
      } else {
        if (auth.user.newbie)
        {
          console.log("return page changed");
          setReturnPath("/twofa");
        }
        if (newUsername)
        {
          try{
            const toSend2 = {
              OldUsername : auth.user.username,
              newUsername : newUsername,
            }
            await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/updateDmName`, {
            method: "POST",
            headers: {
              Authorization: auth.getBearer(),
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(toSend2),
            });
          }
          catch(error)
          {
            console.error(error);
          }
        }
        auth.edit(newUser);
        setUserOk(true);
      }
    }
  }
  catch(e) {console.error(e);}}
  };

  useEffect(() => {
    if (!newUsername && auth.user.username) setNewUsername(auth.user.username);
  }, [auth.user.username, newUsername]);

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
              maxLength={10}
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
