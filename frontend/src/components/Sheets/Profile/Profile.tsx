import VictoryIcon from "@mui/icons-material/EmojiEventsOutlined";
import LoseIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BlockIcon from "@mui/icons-material/BlockOutlined";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "../../user/auth";
import { PageContext } from "../../../context/PageContext";
import { useContext, useRef, useEffect } from "react";
import { CreateStyledCell } from "../CreateStyledCell";
import { Create } from "@mui/icons-material";
import styles from "./Profile.module.css";
import { useParams } from "react-router-dom";
import { error } from "console";

function Profile() {

  const navigate = useNavigate();
  const { login_url } = useParams();
  const empty_user = {
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    login: "",
    email: "",
    avatar: "",
    role: "",
    password: "",
    game_won: 0,
    game_lost: 0,
    game_played: 0,
  };

const empty_gameUser = {
  userId:'',
  userLogin:'', 
  userUsername:'', 
  numberGames: 0,
  numberGamesBasic: 0,
  numberGamesAdvanced:  0,
  numberWon:  0,
  numberLost: 0,
  numberWonBasic: 0,
  numberLostBasic: 0,
  numberWonAdvanced:  0,
  numberLostAdvanced:  0,
  totalGameDurationInSec:  0,
  totalGameDurationBasicInSec:  0,
  totalGameDurationAdvancedInSec:  0,
  games:  0,
}

  const [image, setImage] = useState(
    "https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg"
  );
  const auth = useLogin();
  const [user, setUser] = useState(empty_user);
  const [gameUser, setGameUser] = useState(empty_gameUser);
  const [redirect, setRedirect] = useState(false);

  const fetchImage = async () => {
    const bearer = auth.getBearer();
    const res = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/user/avatar/` + user.avatar, {
      method: "GET",
      headers: { Authorization: bearer },
    });
    console.log("fetchImage on route /user/avatar/", user.avatar);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImage(imageObjectURL);
  };

  const fetchGameUser = async () => {
    const bearer = auth.getBearer();
    const data = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/gameStats/login/${user.login}`, {
      method: "GET",
      headers: { Authorization: bearer },
    });
    const newUser = await data.json();
    if (newUser.message) {
      console.log("error");
    }
    else {
      setGameUser(newUser);
    }
  }

  const fetchUser = async (login: string) => {
    const bearer = auth.getBearer();
    console.log("bearer is", bearer);
    const data = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/user/` + login, {
      method: "GET",
      headers: { Authorization: bearer },
    });
    const newUser = await data.json();
    if (newUser.message) {
      setRedirect(true);
    }
    else {
      setUser(newUser);
    }
  };

  //RESIZE WINDOW
  const [edit, setEdit] = useState(false);
  const context = useContext(PageContext);
  if (!context) { throw new Error('useContext must be used within a MyProvider'); }
  const { scroll, toolbar, zoom } = context;
  const windowWidthRef = useRef(window.innerWidth);
  const forceUpdate = useForceUpdate();


  function calculate_edit_Y() {
    const result = Math.floor((windowWidthRef.current - (windowWidthRef.current / 100 * 2 + 31)) / (80 + (zoom - 100) / 2) - 1);
    return (result > 3 ? result : 4);
  }

  let myuser = auth.user.login;
  if (login_url) { myuser = login_url; }
  
  useEffect(() => {
    try {
      if (!user.login)
        fetchUser(myuser);
    } catch (e) {
      console.log(e);
    }
  }, [auth]);

  useEffect(() => {
    if (user.avatar) {
      try {
        fetchImage().catch((e) => console.log("Failed to fetch the avatar"));
      } catch (e) {
        console.log(e);
      }
    }
    try{
      if (gameUser.userLogin)
        fetchGameUser();
    }catch(e){
      console.log(e);
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      windowWidthRef.current = window.innerWidth;
      forceUpdate();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      color: 'black',
      backgroundColor: 'red',
      top: toolbar ? '89px' : '166px'
    }}>
      <img src={image}
        alt="" className="profilePic"
        style={{
          width: `${(80 + (zoom - 100) / 2) * 2}px`,
          height: `${(20 + (zoom - 100) / 8) * 5}px`,
          objectFit: 'cover',
          position: 'absolute',
          top: `${(20 + (zoom - 100) / 8) * (2 - scroll.scrollX)}px`,
          left: `${0 + (80 + (zoom - 100) / 2) * (1 - scroll.scrollY)}px`,
        }} />
      <CreateStyledCell coordX={8} coordY={1} width={1} height={1} text={"Username"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={8} coordY={2} width={1} height={1} text={user.username} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={9} coordY={1} width={1} height={1} text={"Login"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={9} coordY={2} width={1} height={1} text={user.login} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={10} coordY={1} width={1} height={1} text={"Game Won"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={10} coordY={2} width={1} height={1} text={`${gameUser.numberWon}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={11} coordY={1} width={1} height={1} text={"Game Lost"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={11} coordY={2} width={1} height={1} text={`${gameUser.numberLost}`}  className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={8} coordY={1} width={2} height={4} text={""} className={"border_profile"} fontSize={12} />
      <CreateStyledCell coordX={0} coordY={0} width={1} height={1} text={"/" + login_url || ''} className={"border_profile"} fontSize={12} />
      <CreateStyledCell coordX={0} coordY={1} width={1} height={1} text={user.login || ''} className={"border_profile"} fontSize={12} />
      {(login_url == auth.user.username || !login_url) && <CreateStyledCell coordX={2} coordY={calculate_edit_Y()} width={1} height={1} text={"Edit Profile"} className={"edit_profile"} fontSize={12} onClick={() => setEdit(true)} />}
      {edit && <Navigate to="/edit"/>}
      {redirect && <Navigate to ="/profile"/>}
    </div>
  );
}

function useForceUpdate() {
  const [, setTick] = useState(0);
  const forceUpdate = () => {
    setTick((tick) => tick + 1);
  };
  return forceUpdate;
}
export default Profile;
