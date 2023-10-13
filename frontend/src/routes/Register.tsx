import "./Register.scss"
import {Link} from "react-router-dom";

function Register() {
    return (
        <div className="register">
            <div className="card">
                <div className="left">
                    <h1>Pong.</h1>
                    <p>
                        Salut, ici on joue a pong.
                        Tu connais pas? C'est un jeu de tennis en gros.
                    </p>
                    <span>T'as deja un compte ? Bah vas-y clique.</span>
                    <Link to="/login">
                        <button>Log in</button>
                    </Link>

                </div>
                <div className="right">
                    <h1>Register</h1>
                    <form>
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <input type="password" placeholder="Confirm Password" />
                        <input type="text" placeholder="E-mail" />
                        <button>Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;