import "./Login.scss";
import { Navigate } from "react-router-dom";
import { MouseEvent, useEffect, useState } from "react";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [tokenOk, setTokenOk] = useState(false);

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const data = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ login, password }),
      });
      const token = await data.json();
      if (token.message) {
        console.log("Bad password");
        setLogin("");
        setPassword("");
        setTokenOk(false);
      } else {
        setTokenOk(true);
        sessionStorage.setItem("Token", JSON.stringify(token));
        console.log("token in Login is now", sessionStorage.getItem("Token"));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // const tk: string | null = sessionStorage.getItem("Token");
    // console.log("Login Effect");
    // if (tk != null)
    // {
    //   const stored_token = JSON.parse(tk);
    //   setLogin(stored_token.login);
    // }
    // console.log("In Effect login is now", login);
  }, []);

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
            <input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="on"
              onChange={(e) => setPassword(e.target.value)}
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
