import "./EditProfile.scss";
import { Link, Navigate } from "react-router-dom";
// import UserContext from "../context/userContext";
import { useContext, useEffect, useState, MouseEvent } from "react";
import { useLogin } from "../components/user/auth";
import StringField from "../components/user/StringField";




function Twofa() {
	const auth = useLogin();

  let tmp = auth.user.username;
  if (tmp == null) tmp = "";

  const [login, setLogin] = useState("");
  const [qrcode, setQrcode] = useState();

  const handleTfa = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("Setup Tfa");

    const raw_token: string | null = sessionStorage.getItem("Token");
    let token = { login: "", access_token: "" };
    if (raw_token) token = JSON.parse(raw_token);
    console.log("Token in EditProfile is", token);
    const bearer = "Bearer " + token.access_token;


    let tosend: any= { login: auth.user.login };

    const data = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/twofa/setup`, {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    });
    const qr_url = await data.json();
    console.log ("qr_url is", qr_url);
    setQrcode(qr_url.qrcode_url);

  };

  useEffect(() => {
    const stored_login: string | null = sessionStorage.getItem("Login");
    if (stored_login != null) setLogin(stored_login);
  }, []);

  useEffect(()=>{
    console.log("QRCODE IS", qrcode);
  }, [qrcode])

  return (
    <div className="register">
      <div className="card">
        <div className="right">
          <h1>Two FA Setup</h1>
          <h2>{auth.user.login}</h2>
          <form>
            <button onClick={handleTfa}>Edit</button>
          </form>
           {qrcode && <img src={qrcode} alt="QR" />}
           {!qrcode && <p>No QR now</p>}
        </div>
      </div>
    </div>
  );
}

export default Twofa;
