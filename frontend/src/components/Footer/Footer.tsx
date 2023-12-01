import ContactSupportIcon from '@mui/icons-material/Forum';
import styles from "./Footer.module.css";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import LastPageIcon from '@mui/icons-material/LastPage';


import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { PageContext } from '../../context/PageContext';
import { useContext } from 'react';
import { PageUrlContext } from '../../context/PageUrlContext';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: "#AAAAAA",
    },
    secondary: {
      main: '#AAAAAA',
    },
  },
  typography: {
    fontSize: 10,
  },
});

const themeLight = createTheme({
  palette: {
    primary: {
      main: "#555555",
    },
    secondary: {
      main: '#555555',
    },
  },
  typography: {
    fontSize: 10,
  },
});

const marks = [
  {
    value: 125,
    label: '',
  }
];

function ContinuousSlider() {

  const context = useContext(PageContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { zoom, dark, updateZoom } = context;
  const increment = 5;
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
  const handleChange = (event: Event, newValue: number | number[]) => {
    updateZoom(newValue as number);
  };

  return (
    <div className={styles.slidder}>
      <Box sx={{ width: 190, height: 20 }}>
        <Stack spacing={0.5} direction="row" sx={{ mb: 1 }} alignItems="center">
          <RemoveCircleIcon
            fontSize='small'
            style={{color: dark ? '#AAAAAA' : '#555555', position:'relative', top:'0.5px', height:'14px'}}
            onClick={reduce_zoom}/>
            <ThemeProvider theme={dark ? theme : themeLight}>
              <Slider 
                size="small"
                aria-label="Small"
                value={zoom}
                onChange={handleChange}
                min={50}
                max={200}
                defaultValue={100}
                marks={marks}
                sx={{width:100, height:3}}/>
            </ThemeProvider>
          <AddCircleIcon 
            fontSize='small' 
            style={{color:dark ? '#AAAAAA' : '#555555', position:'relative', top:'0.5px', height:'14px'}}
            onClick={add_zoom}/>
            <div style={{position: 'relative', left:'7px'}}>
              {zoom - 25}%
            </div>
        </Stack>
      </Box>
    </div>
    
  );
}

function Footer() {
  const context = useContext(PageContext);
  const url_context = useContext(PageUrlContext);
  const navigate = useNavigate();
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { chat, dark, updateChat } = context;
  const handleChat = (str : string) => {
    updateChat(str);
  }
  function selectNext() {
    switch(url_context?.page) {
      case "Game" :
        navigate("/profile");
        break;
      case "Profile" :
        navigate("/data");
        break;
      case "Data" :
        navigate("/contacts");
        break;
      default :
        return;
    }
  }
  function selectPrev() {
    switch(url_context?.page) {
      case "Profile" :
        navigate("/game");
        break;
      case "Data" :
        navigate("/profile");
        break;
      case "Contacts" :
        navigate("/data");
        break;
      default :
        return;
    }
  }
  function getPagePlace() {
    switch(url_context?.page) {
      case "Game" :
        return 1;
      case "Profile" :
        return 2;
      case "Data" :
        return 3;
      case "Contacts" :
        return 4
      default :
        return 0;
    }
  }
  return (
	<footer className={dark ? styles.bottom : styles.bottomLight} >
    <FirstPageIcon className={dark ? styles.arrow : styles.arrowLight} onClick={() =>navigate("/game")}/>
    <SkipPreviousIcon className={dark ? styles.arrow : styles.arrowLight} onClick={() =>selectPrev()}/>
    <SkipNextIcon className={dark ? styles.arrow : styles.arrowLight} onClick={() =>selectNext()}/>
    <LastPageIcon className={dark ? styles.arrow : styles.arrowLight} onClick={() =>navigate("/contacts")}/>
    <div className={(url_context?.page === "Game") ? (dark ? styles.sheetPageSelected : styles.sheetPageSelectedLight) : (dark ? styles.sheetPage : styles.sheetPageLight)} style={{left:'100px', width:'50px'}} onClick={() =>navigate("/game")}>
      <div className={styles.text}>Game</div>
    </div>
    <div className={url_context?.page === "Profile" ? (dark ? styles.sheetPageSelected : styles.sheetPageSelectedLight) : (dark ? styles.sheetPage : styles.sheetPageLight)} style={{left:'150px', width:'50px'}} onClick={() =>navigate("/profile")}>
     <div className={styles.text}>Profile</div>
    </div>
    <div className={url_context?.page === "Data" ? (dark ? styles.sheetPageSelected : styles.sheetPageSelectedLight) : (dark ? styles.sheetPage : styles.sheetPageLight)} style={{left:'200px', width:'50px'}} onClick={() =>navigate("/data")}>
     <div className={styles.text}>Data</div>
    </div>
    <div className={url_context?.page === "Contacts" ? (dark ? styles.sheetPageSelected : styles.sheetPageSelectedLight) : (dark ? styles.sheetPage : styles.sheetPageLight)} style={{left:'250px', width:'70px'}} onClick={() =>navigate("/contacts")}>
      <div className={styles.text}>Contacts</div>
    </div>
	  <div className={dark ? styles.sep : styles.sepLight} />
    <div style={{position:'fixed', bottom:'2px', left:'8px'}}>Sheet {getPagePlace()} of 4</div>
    {
      chat.search("Chat") !== -1 ?
      <div className={dark ? styles.button : styles.buttonLight}  onClick={() => handleChat("none")}>
       <ContactSupportIcon className={styles.icon} /> 
        <span className={styles.contact}>
          Chat
        </span>
      </div> :
      <div className={dark ? styles.button : styles.buttonLight} onClick={() => handleChat("Chat")}>
        <ContactSupportIcon className={styles.icon} /> 
        <span className={styles.contact}>
          Chat
        </span>
      </div>
    }
    <ContinuousSlider />
  </footer>
  )
}
export default Footer;