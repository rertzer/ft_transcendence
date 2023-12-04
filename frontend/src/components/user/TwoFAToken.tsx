import { MouseEvent, useEffect, useState } from "react";
import { useLogin } from "./auth";
import { useNavigate } from "react-router-dom";

function TwoFAToken() {
  const auth = useLogin();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [tokenOk, setTokenOk] = useState();

  const handleToken = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (token) {
      const fileData = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/twofa/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: auth.getBearer(),
        },
        body: JSON.stringify({ token }),
      });
      const answer = await fileData.json();
      setTokenOk(answer);
    }
  };

  useEffect(() => {
    if (tokenOk) {
      navigate("/", { replace: true });
    } else if (tokenOk === false) {
      navigate("/login", { replace: true });
    }
  }, [tokenOk, navigate]);

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
