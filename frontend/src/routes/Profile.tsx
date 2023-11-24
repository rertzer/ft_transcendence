import "./Profile.scss";
import VictoryIcon from "@mui/icons-material/EmojiEventsOutlined";
import LoseIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BlockIcon from "@mui/icons-material/BlockOutlined";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "../components/user/auth";
import { PageContext } from "../context/PageContext";
import { useContext, useRef, useEffect } from "react";
import { CreateStyledCell } from "../components/Sheets/CreateStyledCell";
import { Create } from "@mui/icons-material";

function Profile() {
  const auth = useLogin();

  const [edit, setEdit] = useState(false);
  const context = useContext(PageContext);
  if (!context) { throw new Error('useContext must be used within a MyProvider');}
  const { scroll, toolbar, zoom } = context;

  const windowWidthRef = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      windowWidthRef.current = window.innerWidth;
      // Trigger a re-render of the component when window.innerWidth changes
      forceUpdate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const forceUpdate = useForceUpdate();

  function calculate_edit_Y() {
    const result = Math.floor((windowWidthRef.current - (windowWidthRef.current / 100 * 2 + 31))/(80 + (zoom - 100) / 2) - 1);
    return (result > 3 ? result : 3);
  }
  return (
    <div style={{ position:'fixed',
                  color:'black',
                  backgroundColor:'red',
                  top: toolbar ? '89px' : '166px' }}>
      <img  src={auth.image} 
            alt="" className="profilePic" 
            style={{  width:`${(80 + (zoom - 100) / 2) * 2}px`,
                      height:`${(20 + (zoom - 100) / 8) * 5}px`,
                      objectFit: 'cover',
                      position: 'absolute',
                      top: `${(20 + (zoom - 100) / 8) * (2 - scroll.scrollX)}px`,
                      left: `${0 + (80 + (zoom - 100) / 2) * (1 - scroll.scrollY)}px`, }} />
      <CreateStyledCell coordX={8} coordY={1} width={1} height={1} text={"Username"} fontSize={12}/>
      <CreateStyledCell coordX={8} coordY={2} width={1} height={1} text={auth?.user.username} fontSize={12}/>
      <CreateStyledCell coordX={9} coordY={1} width={1} height={1} text={"Login"} fontSize={12}/>
      <CreateStyledCell coordX={9} coordY={2} width={1} height={1} text={auth?.user.login} fontSize={12}/>
      <CreateStyledCell coordX={10} coordY={1} width={1} height={1} text={"Game Won"} fontSize={12}/>
      <CreateStyledCell coordX={10} coordY={2} width={1} height={1} text={auth?.user.game_won} fontSize={12}/>
      <CreateStyledCell coordX={11} coordY={1} width={1} height={1} text={"Game Lost"} fontSize={12}/>
      <CreateStyledCell coordX={11} coordY={2} width={1} height={1} text={auth?.user.game_won} fontSize={12}/>
      <CreateStyledCell coordX={2} coordY={calculate_edit_Y()} width={1} height={1} text={"Edit Profile"} fontSize={12}/>
      {/* <div className="profileContainer">
        <div className="uInfo">
          <div className="left">{auth.user && <p>{auth.user.username}</p>}</div>
          <div className="center">
            <span>{auth.user.login}</span>
            <div className="info">
              <div className="item">
                <VictoryIcon />
                <span>Victoires: {auth.user && auth.user.game_won}</span>
              </div>
              <div className="item">
                <LoseIcon />
                <span>Défaites: {auth.user && auth.user.game_lost}</span>
              </div>
            </div>
            <button onClick={() => setEdit(true)}>Edit profile</button>
            {edit && <Navigate to="/edit"></Navigate>}
          </div>
          <div className="right">
            <ChatIcon />
            <BlockIcon />
          </div>
        </div>
      </div> */}
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
