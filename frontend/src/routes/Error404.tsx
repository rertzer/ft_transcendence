import "./Login.scss";
import { Link } from "react-router-dom";


function Error404() {
  
    

  return (
    <div className="welcome">
      <div className="card">
        <div className="right">
          <h1>Error 404</h1>
          <h2>Page not found</h2>
          <Link to="/"><button>Back home</button></Link>
          
        </div>
      </div>
    </div>
  );
}

export default Error404;