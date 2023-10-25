import "./Login.scss";
import { Link, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ConnectionContext from "../context/authContext";
import { IUser, IContextUser } from "../context/userContext";
import UserContext from "../context/userContext";

type UserConnection = {
  id: string;
  login: string;
  password: string;
};

function Login() {

  const { login, setLogin, password, setPassword } =
    useContext(ConnectionContext);
  const { user, setUser } = useContext(UserContext);

  const [userOk, setUserOk] = useState(false);

  const sendUserConnection = async () => {
    const data = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ login, password }),
    });
    const user = await data.json();
    if (user.message) {
      console.log("Bad password");
      setLogin("");
      setPassword("");
      setUserOk(false);
    } else {
      setUser(user);
      setUserOk(true);
    }
  };

  useEffect(() => {
   
  }, []);

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Pong.</h1>
          <p>
            Salut, ici on joue a pong. Tu connais pas? C'est un jeu de tennis en
            gros.
          </p>
          <span>T'as pas de compte ? Bah vas-y clique.</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <button onClick={sendUserConnection}>Log in</button>
          {userOk && <Navigate to="/"></Navigate>}
        </div>
      </div>
    </div>
  );
}

export default Login;
