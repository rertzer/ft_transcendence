import "./TwoFa.scss";
import {useState, MouseEvent } from "react";
import { useLogin } from "../components/user/auth";
import TwoFAToken from "../components/user/TwoFAToken";
import { useNavigate } from "react-router-dom";

function Twofa() {
  const auth = useLogin();
  const navigate = useNavigate();


  let tmp = auth.user.username;
  if (tmp === null) tmp = "";

  const [qrcode, setQrcode] = useState();

  const handleTfa = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
console.log("handleTfa a")

    const data = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/twofa/setup`, {
      mode: 'cors',
      method: "GET",
      headers: {
        Authorization: auth.getBearer(),
      },
    });
    const qr_url = await data.json();
    console.log("handleTfa b")
    setQrcode(qr_url.qrcode_url);
    console.log("handleTfa c")
  };

const handleCancel= async ()=>{
  const data = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/twofa/cancel`, {
    mode: 'cors',
    method: "GET",
    headers: {
      Authorization: auth.getBearer(),
    },
  });

  console.log("status", data.status);
  if (data.status === 201) {
    const newUser = await data.json();
    auth.edit(newUser);
  navigate('/', { replace: true });}
}

  const handleSkip = async ()=>{
    navigate('/', { replace: true });
  }

  return (
    <div className="register">
      <div className="card">
        <div className="right">
          <h1>Two Factors Authentication</h1>
          <h2>{auth.user.login}</h2>
          {!qrcode &&  <form>
            {!auth.user.tfa_activated && <button onClick={handleTfa}>setup </button>}
            {auth.user.tfa_activated && <button onClick={handleCancel}>remove</button>}
          </form>}
          <button onClick={handleSkip}>skip</button>
          {qrcode && <img src={qrcode} alt="QR" />}
          {qrcode && <TwoFAToken />}
        </div>
      </div>
    </div>
  );
}

export default Twofa;
