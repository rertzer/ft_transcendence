import "./Login.scss";
import { Navigate } from "react-router-dom";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../context/chatContext";

function Login() {
  const [login, setLogin] = useState("");

  const [tokenOk, setTokenOk] = useState(false);
  // const {username, setUsername} = useContext(ConnectionContext)


  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const data = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ login }),
      });
      const token = await data.json();
      if (token.message) {
        console.log("Bad login");
        setLogin("");
        setTokenOk(false);
      } else {
        setTokenOk(true);
        sessionStorage.setItem("Token", JSON.stringify(token));
      }
    } catch (e) {
      console.log(e);
    }
  };

  console.log("Log user ok is", tokenOk);
  return (
    <div className="login">
      <div className="card">
        <div className="right">
          <h1>Log in</h1>
          <form>
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </form>
          <button
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Log in
          </button>
          {tokenOk && <Navigate to="/"></Navigate>}
        </div>
      </div>
    </div>
  );
}

export default Login;
