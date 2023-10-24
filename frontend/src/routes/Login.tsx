import "./Login.scss";
import { Link, Navigate } from "react-router-dom";
//import { AuthContext } from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../context/chatContext";
import ConnectionContext from "../context/authContext";

type UserConnection = {
  id: string;
  login: string;
  password: string;
};

function Login() {
  //const {login} = useContext(AuthContext);
  const { login, setLogin, password, setPassword } =
    useContext(ConnectionContext);

  const [userOk, setUserOk] = useState(false);
  // const handleLogin = () => {
  //     login();
  // }
  const socket = useContext(WebsocketContext);

  const sendUserConnection = async () => {
    setLogin(login);
    setPassword(password);

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
    } else {
      setUserOk(true);
    }

    console.log("json:", user);
  };

  useEffect(() => {
    /*
      if (UserConnection.id === "-1") {
        console.log("wrong id");
        setLogin("");
        setPassword("");
        setuserOk(false);
      } else {
        console.log("login before set", login);
        setLogin(UserConnection.login);
        setPassword(UserConnection.password);
        console.log("here");
        setuserOk(true);
      }
    });
    return () => {
      console.log("Unregistering Events...");
      socket.off("onUserConnection");
    };*/
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
