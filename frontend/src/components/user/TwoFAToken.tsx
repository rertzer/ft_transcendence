import { MouseEvent, useContext, useEffect, useState } from "react";
import { useLogin } from "./auth";

function TwoFAToken(props: {}) {
  const auth = useLogin();
  const [token, setToken] = useState("");

  const handleToken = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (token) {
      const fileData = await fetch("twofa/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: auth.getBearer(),
        },
        body: JSON.stringify({ token }),
      });
      const answer = await fileData.json();
      console.log("Answer is ", answer);
    }
  };

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
