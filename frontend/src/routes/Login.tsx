import "./Login.scss"
import {Link} from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

function Login() {

    const {login} = useContext(AuthContext);

    const handleLogin = () => {
        login();
    }

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Pong.</h1>
                    <p>
                        Salut, ici on joue a pong.
                        Tu connais pas? C'est un jeu de tennis en gros.
                    </p>
                    <span>T'as pas de compte ? Bah vas-y clique.</span>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>

                </div>
                <div className="right">
                    <h1>Log in</h1>
                    <form>
                        <input type="text" placeholder="Login" />
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button onClick={handleLogin}>Log in</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;