import "./Login.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { MouseEvent, useEffect, useState } from "react";
import { useLogin } from "../components/user/auth";

function RedirectTfa() {
  const auth = useLogin();
  const navigate = useNavigate();
  const [tokenOk, setTokenOk] = useState<boolean | undefined>();
  const [key, setKey] = useState<string | undefined>();
  const [tfaToken, setTfaToken] = useState("");

  const location = useLocation();
  console.log("location", location.search);
  const queryParams = new URLSearchParams(location.search);
  const param_key = queryParams.get("key");
  if (param_key && param_key !== key) setKey(param_key);

  console.log("url ", queryParams, "key is", param_key);

  const getToken = async () => {
    console.log("asking for", JSON.stringify({ key, tfaToken }));
    const data = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/ft_auth/tfatoken`, {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ key, tfa_token: tfaToken }),
    });
    console.log("receive data", data);
    const token = await data.json();
    console.log("received token", token);
    let isOk = false;
    if (token.message) {
      console.log("Bad login");
    } else {
      auth.login(token);
      isOk = true;
    }
    setTokenOk(isOk);
  };

  const handleTfaToken = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (tfaToken) {
      getToken();
    }
  };

  useEffect(() => {}, [key]);

  useEffect(() => {
    if (tokenOk) {
      navigate("/", { replace: true });
    } else if (tokenOk === false) {
      navigate("/login", { replace: true });
    }
  }, [tokenOk]);

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Log in</h1>
          <form>
            <input
              type="text"
              placeholder={"enter the token"}
              value={tfaToken}
              onChange={(e) => setTfaToken(e.target.value)}
            />
            <button
              onClick={(e) => {
                handleTfaToken(e);
              }}
            >
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RedirectTfa;
