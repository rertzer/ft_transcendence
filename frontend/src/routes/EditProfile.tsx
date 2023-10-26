import "./EditProfile.scss";
import { Link, Navigate } from "react-router-dom";
import UserContext from "../context/userContext";
import { useContext, useEffect, useState } from "react";

function Register() {
  const { user, setUser } = useContext(UserContext);

  const [editOk, setEditOk] = useState(false);
  const [newUsername, setnewUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [newEmail, setnewEmail] = useState(user.email);
  const [confPasswordClass, setConfPasswordClass] = useState("NA");

  interface IToSend
  {
    login : string,
    username?: string,
    password?: string,
    email?:string,
  }

  
  
  const editUser = async () => {
    if (confPasswordClass !== 'KO')
    {
      
      //const login = user.login;
      let tosend: IToSend = {login: user.login};
      if (newUsername)
        tosend.username = newUsername;
      if (newPassword)
        tosend.password = newPassword;
      if (newEmail)
        tosend.email = newEmail;
      
      console.log(JSON.stringify(tosend));
      const data = await fetch("http://localhost:4000/auth/edit", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(tosend),
      });
      const newUser = await data.json();
      if (newUser.message) {
        console.log("Bad password");
        setNewPassword("");
        setConfPassword("");
        setConfPasswordClass("NA");
      } else {
        setUser(newUser);
        setEditOk(true);
      }
    }
    else
    console.log("BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD");
  }
  
  useEffect(() => {
    if (confPassword && newPassword) {
      if (confPassword === newPassword) setConfPasswordClass("OK");
      else setConfPasswordClass("KO");
    } else setConfPasswordClass("NA");
  }, [newPassword, confPassword]);

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
              onChange={(e) => setnewEmail(e.target.value)}
            />
            
            <button onClick={editUser}>Edit</button>
          {editOk && <Navigate to="/profile"></Navigate>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
