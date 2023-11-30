import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "../../user/auth";
import { PageContext } from "../../../context/PageContext";
import { useContext, useRef, useEffect } from "react";
import { CreateStyledCell } from "../CreateStyledCell";
import { useParams } from "react-router-dom";

function Profile() {

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
  
  interface statObject {
    userId: number,
    userLogin: string, 
    userUsername: string | null, 
    numberGames: number,
    numberGamesBasic: number,
    numberGamesAdvanced: number,
    numberWon: number,
    numberLost: number,
    numberWonBasic: number,
    numberLostBasic: number,
    numberWonAdvanced: number,
    numberLostAdvanced: number,
    totalGameDurationInSec: number,
    totalGameDurationBasicInSec: number,
    totalGameDurationAdvancedInSec: number,
    games?: {
      id: number;
      type: string;
      game_status: string | null;
      won: boolean;
      opponentId: any;
      opponentUserName: any;
      opponentLogin: any;
      myScore: number | null;
      myOpponentScore: number | null;
      date_begin: Date;
      durationInSec: number | undefined;
    }[]
  }

  const empty_gameUser : statObject = {
    userId:0,
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
    games: [
      {
        id: 1,
        type: 'Chess',
        game_status: 'Completed',
        won: true,
        opponentId: 2,
        opponentUserName: 'opponent_user',
        opponentLogin: 'opponent123',
        myScore: 3,
        myOpponentScore: 2,
        date_begin: new Date(),
        durationInSec: 1800,
      },
    ],
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
    return (result > 4 ? result : 5);
  }

  let myuser = auth.user.login;
  if (login_url) { myuser = login_url; }

  function isAuth() {
    return (login_url == auth.user.username || !login_url);
  }

  function AddLine (game: any, index: number) {
    return (<CreateStyledCell coordX={index + 15} coordY={0} width={1} height={1} text={game.opponentLogin} fontSize={12} className={"title_profile"}/>);
  }
  
  useEffect(() => {
    try {
      if (!(user.login) && myuser) {
        fetchUser(myuser);
      }
    } catch (e) {
      console.log(e);
    }
  }, [auth, login_url]);

  useEffect(() => {
    if (user.avatar) {
      try {
        fetchImage().catch((e) => console.log("Failed to fetch the avatar"));
      } catch (e) {
        console.log(e);
      }
    }
    try{
      if (!gameUser.userLogin)
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
          width: `${(80 + (zoom - 100) / 2) * 1}px`,
          height: `${(20 + (zoom - 100) / 8) * 3}px`,
          objectFit: 'cover',
          position: 'absolute',
          top: `${(20 + (zoom - 100) / 8) * (3 - scroll.scrollX)}px`,
          left: `${0 + (80 + (zoom - 100) / 2) * (4 - scroll.scrollY)}px`,
          border: '2px solid black'
        }} />
      <CreateStyledCell coordX={3} coordY={1} width={1} height={1} text={"Username"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={3} coordY={2} width={isAuth() ? 2 : 1} height={1} text={user.username} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={4} coordY={1} width={1} height={1} text={"Login"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={4} coordY={2} width={isAuth() ? 2 : 1} height={1} text={user.login} className={"data_profile"} fontSize={12} />
      {isAuth() && <CreateStyledCell coordX={5} coordY={1} width={1} height={1} text={"email"} className={"title_profile"} fontSize={12} />}
      {isAuth() && <CreateStyledCell coordX={5} coordY={2} width={2} height={1} text={user.email} className={"data_profile"} fontSize={12} />}
      <CreateStyledCell coordX={3} coordY={1} width={isAuth() ? 3 : 2} height={isAuth() ? 3 : 2} text={""} className={"border_profile"} fontSize={12} />
      
      <CreateStyledCell coordX={7} coordY={2} width={1} height={1} text={"Basic"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={7} coordY={3} width={1} height={1} text={"Advanced"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={7} coordY={4} width={1} height={1} text={"Total"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={8} coordY={1} width={1} height={1} text={"Games"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={8} coordY={2} width={1} height={1} text={`${gameUser.numberGamesBasic}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={8} coordY={3} width={1} height={1} text={`${gameUser.numberGamesAdvanced}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={8} coordY={4} width={1} height={1} text={`${gameUser.numberGames}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={9} coordY={1} width={1} height={1} text={"Wins"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={9} coordY={2} width={1} height={1} text={`${gameUser.numberWonBasic}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={9} coordY={3} width={1} height={1} text={`${gameUser.numberWonAdvanced}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={9} coordY={4} width={1} height={1} text={`${gameUser.numberWon}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={10} coordY={1} width={1} height={1} text={"Losses"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={10} coordY={2} width={1} height={1} text={`${gameUser.numberLostBasic}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={10} coordY={3} width={1} height={1} text={`${gameUser.numberLostAdvanced}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={10} coordY={4} width={1} height={1} text={`${gameUser.numberLost}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={11} coordY={1} width={1} height={1} text={"Sec. in game"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={11} coordY={2} width={1} height={1} text={`${gameUser.totalGameDurationBasicInSec}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={11} coordY={3} width={1} height={1} text={`${gameUser.totalGameDurationAdvancedInSec}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={11} coordY={4} width={1} height={1} text={`${gameUser.totalGameDurationInSec}`} className={"data_profile"} fontSize={12} />
      <CreateStyledCell coordX={7} coordY={2} width={3} height={5} text={""} className={"border_profile"} fontSize={12} />
      <CreateStyledCell coordX={8} coordY={1} width={4} height={4} text={""} className={"border_profile"} fontSize={12} />

      <CreateStyledCell coordX={14} coordY={1} width={1} height={1} text={"Type"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={14} coordY={2} width={1} height={1} text={"Game status"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={14} coordY={3} width={1} height={1} text={"Won"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={14} coordY={4} width={1} height={1} text={"Opponent"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={14} coordY={5} width={1} height={1} text={"Score"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={14} coordY={6} width={1} height={1} text={"Opponent score"} className={"title_profile"} fontSize={9} />
      <CreateStyledCell coordX={14} coordY={7} width={1} height={1} text={"Date"} className={"title_profile"} fontSize={12} />
      <CreateStyledCell coordX={14} coordY={8} width={1} height={1} text={"Duration"} className={"title_profile"} fontSize={12} />
      
      {gameUser.games?.map((game, index) => (
        <CreateStyledCell coordX={index + 16} coordY={0} width={1} height={1} text={"Duration"} className={"title_profile"} fontSize={12} />)
      )}

      {(login_url == auth.user.username || !login_url) && <CreateStyledCell coordX={1} coordY={calculate_edit_Y()} width={1} height={1} text={"Edit Profile"} className={"edit_profile"} fontSize={12} onClick={() => setEdit(true)} />}
      {edit && <Navigate to="/profile/edit"/>}
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
