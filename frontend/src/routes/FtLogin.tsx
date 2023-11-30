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
    //event.preventDefault();
    window.open(`https://${process.env.REACT_APP_URL_MACHINE}:4000/ft_auth/login`, "_self");
    

    // try {
    //   const data = await fetch("/ft_auth/login", {
    //     mode: 'cors',
    //     method: "GET"
    //   });
    //   const token = await data.json();
    //   let token_status = false;
    //   if (token.message) {
    //     console.log("Bad login");
    //     //setLogin("");
    //   } else {
    //     token_status = true;

    //     auth.login(token);
    //     navigate(redirectPath, { replace: true });
    //   }
    //   setTokenOk(token_status);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  console.log("Log user ok is", tokenOk);

  return (
    <div className="login">
      <div className="card">
        <div className="right">
          <h1>Log in</h1>
          <button onClick={(e) => {handleSubmit(e)}}> login with 42</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
