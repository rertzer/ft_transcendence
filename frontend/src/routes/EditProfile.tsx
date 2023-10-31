import "./EditProfile.scss";
import { Navigate } from "react-router-dom";
import { MouseEvent, useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";

function EditProfile() {
  const [login, setLogin] = useState("");
  const [newUsername, setnewUsername] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [userOk, setUserOk] = useState(false);

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const data = await fetch("http://localhost:4000/auth/edit", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ login, username: newUsername }),
    });
    const newUser = await data.json();
    if (newUser.message) {
      console.log("Baaad");
      setnewUsername("");
      setUserOk(false);
    } else {
      setUser(newUser);
      setUserOk(true);
      sessionStorage.setItem("Login", newUser.login);
      console.log("Edited!!!", userOk);
    }
  };

  useEffect(() => {
    let stored_login: string | null = sessionStorage.getItem("Login");
    if (stored_login != null) setLogin(stored_login);
  }, []);

  console.log("edit ok is", userOk);
  return (
    <div className="register">
      <div className="card">
        <div className="right">
          <h1>Edit profile Debug</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setnewUsername(e.target.value)}
            />
          </form>
          <button
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Edit
          </button>
          {userOk && <Navigate to="/Profile"></Navigate>}
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
