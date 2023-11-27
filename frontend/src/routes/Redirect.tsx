import "./Login.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { MouseEvent, useEffect, useState } from "react";
import { useLogin } from "../components/user/auth";

function Redirect() {
  const auth = useLogin();
  const navigate = useNavigate();
  const [tokenOk, setTokenOk] = useState<boolean | undefined>();
  const [key, setKey] = useState<string | undefined>();

  const location = useLocation();
  console.log("location", location.search);
  const queryParams = new URLSearchParams(location.search);
  const param_key = queryParams.get("key");
  if (param_key && param_key !== key) setKey(param_key);
  
  console.log("url ", queryParams, "key is", param_key);

  const getToken = async () => {
    const flatkey = JSON.stringify({ key });
    console.log("asking for", flatkey);
    const data = await fetch("/ft_auth/token", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: flatkey,
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
 
  useEffect(() => {
    if (key) {
      try {
        console.log("ici");
        getToken();
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("no key");
    }
  }, [key]);

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
          <p>login in progress, please wait</p>
        </div>
      </div>
    </div>
  );
}

export default Redirect;
