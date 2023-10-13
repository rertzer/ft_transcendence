import "./Login.scss"
import {Link} from "react-router-dom";

function Login() {
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
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button>Log in</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;