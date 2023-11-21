import "./Login.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { MouseEvent, useEffect, useState } from "react";
import { useLogin } from "../components/user/auth";

function Login() {
  const [login, setLogin] = useState("");
  const auth = useLogin();

  const [tokenOk, setTokenOk] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.path || "/";

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
      } else {
        token_status = true;

        auth.login(token);
        navigate(redirectPath, { replace: true });
      }
      setTokenOk(token_status);
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
