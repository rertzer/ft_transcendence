import { useContext, useEffect, useState } from 'react';
import styles from "./Header.module.css";
import style from "./SelectBar.module.css"
import { PageContext } from '../../context/PageContext';
import GameContext from '../../context/gameContext';

import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { useLogin } from '../user/auth';
import { gameSocket } from '../game/services/gameSocketService';
import gameContext from '../../context/gameContext';



function BasicMenu() {
	function  File() {
		const context = useContext(PageContext);
		if (!context) {
			throw new Error('useContext must be used within a MyProvider');
		}
		const { updateMenu } = context;
		const auth = useLogin();

		function print() {
			updateMenu('none');
			window.print();
		}
		function closeTab() {
			window.close();
		}
		function newBasicGame (){
			handlePage("Game");
			setModeGame('BASIC');
			gameSocket.emit('match_me', {playerName:playerName, typeGame:'BASIC'});
		}

		function newAdvancedGame() {
			handlePage("Game");
			setModeGame('ADVANCED');
			gameSocket.emit('match_me', {playerName:playerName, typeGame:'ADVANCED'});
		}
    const {roomId, playerName, setGameStatus, setRoomId, setModeGame, modeGame} = useContext(gameContext);
    const leaveRoom = () => {
		const dataToSend = {
			waitingRoom: (gameStatus === 'IN_WAITING_ROOM'), 
			modeGame: modeGame, 
			roomId: roomId
		};
      gameSocket.emit("i_am_leaving", dataToSend);
      setGameStatus('NOT_IN_GAME');
      setRoomId(0);
      setModeGame('');
      updatePageMenuChat("Game", 'none', chat);
    };
    const {gameStatus} = useContext(GameContext);

		return (
		<List dense onMouseLeave={() => handleClick("none")}  sx={{color: dark ? 'white' : '#111111',}} style={{position: 'fixed', top:'64px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: dark ? '#2f2f2f': 'white', border: dark ? '1px solid black' : '1px solid grey'}} >
			{gameStatus === 'NOT_IN_GAME' && <ListItem button>
			  <ListItemText onClick={() => newBasicGame ()}>New Basic Game</ListItemText>
			</ListItem>}
			{gameStatus === 'NOT_IN_GAME' && <ListItem button>
			  <ListItemText onClick={() => newAdvancedGame()}>New Advanced Game</ListItemText>
			</ListItem>}
			{gameStatus === 'NOT_IN_GAME' && <ListItem sx={{color: 'grey'}} style={{cursor: 'default'}}>
			  <ListItemText>Leave room</ListItemText>
			</ListItem>}
      {gameStatus !== 'NOT_IN_GAME' && <ListItem sx={{color: 'grey'}} style={{cursor: 'default'}}>
			  <ListItemText>New Basic Game</ListItemText>
			</ListItem>}
			{gameStatus !== 'NOT_IN_GAME' && <ListItem sx={{color: 'grey'}} style={{cursor: 'default'}}>
			  <ListItemText>New Advanced Game</ListItemText>
			</ListItem>}
			{gameStatus !== 'NOT_IN_GAME' && <ListItem button>
			  <ListItemText onClick={() => leaveRoom()}>Leave Room</ListItemText>
			</ListItem>}
      <Divider/>
			<ListItem button onClick={() => handlePage("Profile")}><ListItemText>Profile </ListItemText></ListItem>
			<ListItem button onClick={() => handlePage("Data")}><ListItemText>Data </ListItemText></ListItem>
			<ListItem button onClick={() => handlePage("Contacts")}><ListItemText>Contacts </ListItemText></ListItem>
			<Divider/>
			<ListItem button onClick={() => handleChat("Chat")}>{chat === "Chat" ? <CheckBoxOutlinedIcon fontSize="small"/>: <CheckBoxOutlineBlankIcon fontSize="small"/>} <ListItemText style={{position:'relative', left:'10px'}}>Chat </ListItemText></ListItem>
			<Divider/>
			<ListItem button onClick={print}><ListItemText>Print </ListItemText></ListItem>
			<ListItem button onClick={auth.logout}><ListItemText>Logout </ListItemText></ListItem>
			{window.opener !== null ? <ListItem button onClick={closeTab}><ListItemText>Exit PongOffice </ListItemText></ListItem> 
                              : <ListItem ><ListItemText sx={{color: 'grey'}} style={{cursor: 'default'}}>Exit PongOffice </ListItemText></ListItem>}
		</List>
		);
	}
	function  Edit() {
		const context = useContext(PageContext);
		if (!context) {
		throw new Error('useContext must be used within a MyProvider');
		}

		const { coords, updateCoordsMenu } = context;
		const { coordX, coordY } = coords;

		return (
		<List dense onMouseLeave={() => handleClick("none")} sx={{color: dark ? 'white' : '#111111',}} style={{position: 'fixed', top:'64px', left:'45px', width:200, paddingTop: "0px", paddingBottom: "0px",backgroundColor: dark ? '#2f2f2f': 'white', border: dark ? '1px solid black' : '1px solid grey'}} >
			<ListItem button >
			<ContentCopy fontSize="small"/>
			<ListItemText style={{position:'relative', left:'10px'}}>Copy</ListItemText>
			<Typography fontSize="12px" color="text.disabled">Ctrl+C</Typography>
			</ListItem>
			<ListItem button>
			<ContentCut fontSize="small"/>
			<ListItemText style={{position:'relative', left:'10px'}}>Cut</ListItemText>
			<Typography fontSize="12px" color="text.disabled">Ctrl+X</Typography>
			</ListItem>
			<ListItem button>
			<ContentPaste fontSize="small"/>
			<ListItemText style={{position:'relative', left:'10px'}}>Paste</ListItemText>
			<Typography fontSize="12px" color="text.disabled">Ctrl+V</Typography>
			</ListItem>
			<Divider/>
			<ListItem button onClick={() => updateCoordsMenu({coordX: -1,coordY: coordY}, 'none')}><ListItemText>Select Row </ListItemText></ListItem>
			<ListItem button onClick={() => updateCoordsMenu({coordX: coordX,coordY: -1},'none')}><ListItemText>Select Column </ListItemText></ListItem>
			<ListItem button onClick={() => updateCoordsMenu({coordX: -1,coordY: -1}, 'none')}><ListItemText>Select All </ListItemText></ListItem>
		</List>
		);
	}
	function  View() {
		const context = useContext(PageContext);
		if (!context) {
		throw new Error('useContext must be used within a MyProvider');
		}
		const { zoom, updateZoom } = context;
		const increment = 10;
		function add_zoom() {
		if (zoom + increment > 200)
			updateZoom(200);

		else
			updateZoom(zoom + increment);
		console.log(zoom);
		}
		function reduce_zoom() {
		if (zoom - increment < 50)
			updateZoom(50);

      else
        updateZoom(zoom - increment);
    }
    const { toolbar, updateToolbar } = context;
    function toggleToolbar() {
      updateToolbar(!toolbar);
    }
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: dark ? 'white' : '#111111',}} style={{position: 'fixed', top:'64px', left:'90px', width:200, paddingTop: "0px", paddingBottom: "0px",backgroundColor: dark ? '#2f2f2f': 'white', border: dark ? '1px solid black' : '1px solid grey'}} >
        <ListItem button onClick={toggleToolbar}>{toolbar ? <CheckBoxOutlineBlankIcon fontSize="small"/>: <CheckBoxOutlinedIcon fontSize="small"/>} <ListItemText style={{position:'relative', left:'10px'}}>Toolbar </ListItemText></ListItem>
        <Divider/>
        <ListItem button onClick={add_zoom}><ZoomInIcon /><ListItemText style={{position:'relative', left:'10px'}}>Zoom In </ListItemText></ListItem>
        <ListItem button onClick={reduce_zoom}><ZoomOutIcon /><ListItemText style={{position:'relative', left:'10px'}}>Zoom Out </ListItemText></ListItem>
      </List>
    );
  }
  function  Styles() {
		const context = useContext(PageContext);
		if (!context) {
			throw new Error('useContext must be used within a MyProvider');
		}
		const { dark, updateDark } = context;
    function lightMode(mode: boolean) {
      handleClick("none");
      updateDark(mode);
    }
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: dark ? 'white' : '#111111',}} style={{position: 'fixed', top:'64px', left:'135px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: dark ? '#2f2f2f': 'white', border: dark ? '1px solid black' : '1px solid grey'}} >
        <ListItem button onClick={() => lightMode(false)}>
          { dark ? <RadioButtonUncheckedIcon style={{height:'15px'}}/> : <RadioButtonCheckedIcon style={{height:'15px'}}/>}
          <ListItemText style={{position:'relative', left:'10px'}}>Light </ListItemText>
        </ListItem>
        <ListItem button onClick={() => lightMode(true)}>
          { dark ? <RadioButtonCheckedIcon style={{height:'15px'}}/> : <RadioButtonUncheckedIcon style={{height:'15px'}}/> }
          <ListItemText style={{position:'relative', left:'10px'}}>Dark </ListItemText>
        </ListItem>
      </List>
    );
  }
  function  Window() {
    function openNewTab() {
      const isLocalhost = window.location.hostname === 'localhost';
      let url;
      if (isLocalhost)
        url = 'http://localhost:3000/';
      else 
        url = 'http://' + process.env.REACT_APP_URL_MACHINE + ':3000/';
      window.open(url, '_blank');
    }
    function closeTab() {
      window.close();
    }
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: dark ? 'white' : '#111111',}} style={{position: 'fixed', top:'64px', left:'190px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: dark ? '#2f2f2f': 'white', border: dark ? '1px solid black' : '1px solid grey'}} >
        <ListItem button onClick={openNewTab}><ListItemText>New Window </ListItemText></ListItem>
        {window.opener !== null ? <ListItem button onClick={closeTab}><ListItemText>Close Window </ListItemText></ListItem>
                                : <ListItem ><ListItemText sx={{color: 'grey'}} style={{cursor: 'default'}}>Close Window </ListItemText></ListItem>                                                   }
      </List>
    );
  }function  Help() {
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: dark ? 'white' : '#111111',}} style={{position: 'fixed', top:'64px', left:'255px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: dark ? '#2f2f2f': 'white', border: dark ? '1px solid black' : '1px solid grey'}} >
        <ListItem button><PsychologyAltIcon fontSize="small"/><ListItemText style={{position:'relative', left:'10px'}}>What's this ? </ListItemText></ListItem>
        <ListItem button><KeyboardIcon fontSize="small"/><ListItemText style={{position:'relative', left:'10px'}}>Controls </ListItemText></ListItem>
        <Divider/>
        <ListItem button><InfoIcon fontSize="small"/><ListItemText style={{position:'relative', left:'10px'}}>About us </ListItemText ></ListItem>
      </List>
    );
  }
  function BarSwitch () {
      const context = useContext(PageContext);
      if (!context) {
        throw new Error('useContext must be used within a MyProvider');
      }
    switch(context?.menu) {
      case "File" :
        return <File/>;
      case "Edit" :
        return <Edit/>;
      case "View" :
        return <View/>;
      case "Styles" :
        return <Styles/>;
      case "Window" :
        return <Window/>;
      case "Help" :
        return <Help/>;
      default :
        return;
    }
  }
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { page, chat, dark, updatePageMenuChat, updateMenu, updateGame } = context;
  function handleClick(str : string) {
    updateMenu(str);
  }
  function handlePage(str : string) {
    updatePageMenuChat(str, "none", chat);
    console.log(page);
  }
  function handleChat(str : string) {
    if (str === chat)
      updatePageMenuChat(page, "none", "none");
    else
      updatePageMenuChat(page, "none", str);
  }
  const darkTheme = createTheme({
    palette: {
      text: {
        primary: dark ? '#FFFFFF' : '#FF0000',
        secondary: '#FFFFFF',
        disabled: 'grey',
      },
      action: {
        active: 'white',
        selected: 'white',
        disabledBackground: 'white',
        hover: dark ? '#15539e' : '#2f7ddb',
        disabled: 'white',
      },
      background: {
        default: '#2f2f2f',
        paper: '#2f2f2f',
      },
      divider: '#1a1a1a',
    },
  });
  const lightTheme = createTheme({
    palette: {
      text: {
        primary: '#FF0000',
        secondary: 'white',
        disabled: 'light-grey',
      },
      action: {
        active: 'white',
        selected: 'white',
        disabledBackground: 'black',
        hover: '#2f7ddb',
        disabled: 'black',
      },
      background: {
        default: 'white',
        paper: 'white',
      },
      divider: '#1a1a1a',
    },
  });
  const divStyle = {
    left: '0px',
    width: '45px',
  };
  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <div className={dark ? style.file : style.fileLight} style={{left: '0px',width: '45px'}} onMouseEnter={() => handleClick("File")}>
        <div className={dark ? style.file1 : style.file1Light} style={{width: '45px'}}>File</div>
      </div>
      <div className={dark ? style.file : style.fileLight} style={{left: '45px',width: '45px'}} onMouseEnter={() => handleClick("Edit")}>
        <div className={dark ? style.file1 : style.file1Light} style={{width: '45px',}}>Edit</div>
      </div>
      <div className={dark ? style.file : style.fileLight} style={{left: '90px',width: '45px'}} onMouseEnter={() => handleClick("View")}>
        <div className={dark ? style.file1 : style.file1Light} style={{width: '45px',}}>View</div>
      </div>
      <div className={dark ? style.file : style.fileLight} style={{left: '135px',width: '55px'}} onMouseEnter={() => handleClick("Styles")}>
        <div className={dark ? style.file1 : style.file1Light} style={{width: '55px',}}>Styles</div>
      </div>
      <div className={dark ? style.file : style.fileLight} style={{left: '190px',width: '65px'}} onMouseEnter={() => handleClick("Window")}>
        <div className={dark ? style.file1 : style.file1Light} style={{width: '65px',}}>Window</div>
      </div>
      <div className={dark ? style.file : style.fileLight} style={{left: '255px',width: '45px'}} onMouseEnter={() => handleClick("Help")}>
        <div className={dark ? style.file1 : style.file1Light} style={{width: '45px',}}>Help</div>
      </div>
      {BarSwitch()}
    </ThemeProvider>
  );
}

	export function SelectBar({}) {
	const context = useContext(PageContext);
	if (!context) {
		throw new Error('useContext must be used within a MyProvider');
	}
	const { menu, dark, updateMenu } = context;

	return (
    <div>
			<div className={styles.textBar}>
				<div className={dark ? styles.textBar1 : styles.textBar1Light}/>
        { menu !== 'none' && <div onMouseEnter={() => updateMenu("none")} style={{position: 'fixed', width:'100%', height:'100%'}}/>}
				<BasicMenu />
			</div>
		</div>);
}
