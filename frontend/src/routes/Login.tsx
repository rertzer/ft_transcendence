import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { MouseEvent, useEffect, useState } from "react";

function Login() {
  const [login, setLogin] = useState("");
  const [tokenOk, setTokenOk] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const data = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ login }),
      });
      const token = await data.json();
      let token_status = false;
      if (token.message) {
        console.log("Bad login");
        //setLogin("");
      } else {
        token_status = true;
        sessionStorage.setItem("Token", JSON.stringify(token));
      }
      setTokenOk(token_status);
    } catch (e) {
      console.log(e);
    }
  };

  console.log("Log user ok is", tokenOk);
  useEffect(() => {
    console.log("use effect token is", tokenOk);
    if (tokenOk) navigate("/game");
  }, [tokenOk]);

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
            <button
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
