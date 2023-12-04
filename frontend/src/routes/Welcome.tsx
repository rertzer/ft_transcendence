import "./Login.scss";
import { useNavigate, NavLink } from "react-router-dom";
import { useLogin } from "../components/user/auth";

function Welcome() {
  
    const auth = useLogin();
    const navigate = useNavigate();
    const handleLogout = ()=>
    {
      auth.logout();
      navigate('/');
    }

  return (
    <div className="welcome">
      <div className="card">
        <div className="right">
          <h1>Welcome to Pong</h1>
          {!auth.user.login && <NavLink to = "/login">login</NavLink>}<br />
          {auth.user.login && <button onClick={handleLogout}>logout</button>}<br />
          <NavLink to ="/profile">profile</NavLink>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
