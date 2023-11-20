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
import { MyContext } from '../../context/PageContext';
import { useContext } from 'react';

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

const marks = [
  {
    value: 125,
    label: '',
  }
];

function ContinuousSlider() {

  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { zoom, updateZoom } = context;
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
            style={{color:'#AAAAAA', position:'relative', top:'0.5px', height:'14px'}}
            onClick={reduce_zoom}/>
            <ThemeProvider theme={theme}>
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
            style={{color:'#AAAAAA', position:'relative', top:'0.5px', height:'14px'}}
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
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { chat, updateChat } = context;
  const { page, updatePage } = context;
  const handleChat = (str : string) => {
    updateChat(str);
  }
  function selectNext() {
    switch(page) {
      case "Project" :
        updatePage("Profile");
        break;
      case "Profile" :
        updatePage("Data");
        break;
      case "Data" :
        updatePage("Contacts");
        break;
      default :
        return;
    }
  }
  function selectPrev() {
    switch(page) {
      case "Profile" :
        updatePage("Project");
        break;
      case "Data" :
        updatePage("Profile");
        break;
      case "Contacts" :
        updatePage("Data");
        break;
      default :
        return;
    }
  }
  function getPagePlace() {
    switch(page) {
      case "Project" :
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
	<footer className={styles.bottom} >
    <FirstPageIcon className={styles.arrow} onClick={() =>updatePage("Project")}/>
    <SkipPreviousIcon className={styles.arrow} onClick={() =>selectPrev()}/>
    <SkipNextIcon className={styles.arrow} onClick={() =>selectNext()}/>
    <LastPageIcon className={styles.arrow} onClick={() =>updatePage("Contacts")}/>
    <div className={(page === "Project") ? styles.sheetPageSelected : styles.sheetPage} style={{left:'100px', width:'50px'}} onClick={() =>updatePage("Project")}>
      <div className={styles.text}>Game</div>
    </div>
    <div className={page === "Profile" ? styles.sheetPageSelected : styles.sheetPage} style={{left:'150px', width:'50px'}} onClick={() =>updatePage("Profile")}>
     <div className={styles.text}>Profile</div>
    </div>
    <div className={page === "Data" ? styles.sheetPageSelected : styles.sheetPage} style={{left:'200px', width:'50px'}} onClick={() =>updatePage("Data")}>
     <div className={styles.text}>Data</div>
    </div>
    <div className={page === "Contacts" ? styles.sheetPageSelected : styles.sheetPage} style={{left:'250px', width:'70px'}} onClick={() =>updatePage("Contacts")}>
      <div className={styles.text}>Contacts</div>
    </div>
	  <div className={styles.sep} />
    <div style={{position:'fixed', bottom:'2px', left:'8px'}}>Sheet {getPagePlace()} of 4</div>
    {
      chat === "Chat" ?
      <div className={styles.button} onClick={() => handleChat("none")}>
       <ContactSupportIcon className={styles.icon} /> 
        <span className={styles.contact}>
          Chat
        </span>
      </div> :
      <div className={styles.button} onClick={() => handleChat("Chat")}>
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