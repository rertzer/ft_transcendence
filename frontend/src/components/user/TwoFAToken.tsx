import { MouseEvent, useContext, useEffect, useState } from "react";
import { useLogin } from "./auth";
import { useLocation, useNavigate } from "react-router-dom";

function TwoFAToken(props: {}) {
  const auth = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.path || "/";
  const [token, setToken] = useState("");
  const [tokenOk, setTokenOk] = useState();

  const handleToken = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (token) {
      const fileData = await fetch("/twofa/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: auth.getBearer(),
        },
        body: JSON.stringify({ token }),
      });
      const answer = await fileData.json();
      console.log("Answer is ", answer);
      setTokenOk(answer);
    }
  };

  useEffect(() => {
    if (tokenOk) {
      navigate("/", { replace: true });
    } else if (tokenOk === false) {
      navigate("/login", { replace: true });
    }
  }, [tokenOk]);

  return (
    <form>
      <input
        type="text"
        placeholder={"enter the token"}
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        onClick={(e) => {
          handleToken(e);
        }}
      >
        submit
      </button>
    </form>
  );
}

export default TwoFAToken;
