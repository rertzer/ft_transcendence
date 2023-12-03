import "./Login.scss";
import { MouseEvent } from "react";

function Login() {

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    //event.preventDefault();
    window.open(`http://${process.env.REACT_APP_URL_MACHINE}:4000/ft_auth/login`, "_self");
    
  };

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
