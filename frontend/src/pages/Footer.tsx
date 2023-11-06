import { Tooltip } from '@mui/material'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import styles from "./Footer.module.css";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { MyContext } from '../context/PageContext';
import React, { useContext, useState, useEffect } from 'react';

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
    value: 100,
    label: '',
  }
];

function ContinuousSlider() {
  const [value, setValue] = React.useState<number>(30);
  const increment = 5;
  function add_zoom() {
    if (value + increment > 200)
      setValue(200);
    else
      setValue(value + increment);
    console.log(value); 
  }

  function reduce_zoom() {
    if (value - increment < 0)
      setValue(0);
    else
      setValue(value - increment);
    console.log(value); 
  }

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <div className={styles.slidder}>
      <Box sx={{ width: 150, height: 20 }}>
        <Stack spacing={0.5} direction="row" sx={{ mb: 1 }} alignItems="center">
          <RemoveCircleIcon
            fontSize='small'
            style={{color:'#AAAAAA', position:'relative', top:'0.5px', height:'14px'}}
            onClick={reduce_zoom}/>
            <ThemeProvider theme={theme}>
              <Slider 
                size="small"
                aria-label="Zoom"
                value={value}
                onChange={handleChange}
                min={0}
                max={200}
                defaultValue={100}
                marks={marks}
                sx={{width:100, height:3}}/>
            </ThemeProvider>
          <AddCircleIcon 
            fontSize='small' 
            style={{color:'#AAAAAA', position:'relative', top:'0.5px', height:'14px'}}
            onClick={add_zoom}/>
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
  const handleChat = (str : string) => {
    updateChat(str);
  }
  return (
	<footer className={styles.bottom} >
    {
      chat === "Chat" ?
      <div className={styles.button} onClick={() => handleChat("none")}>
       <ContactSupportIcon className={styles.icon} /> 
        <span className={styles.contact}>
          Contacts
        </span>
      </div> :
      <div className={styles.button} onClick={() => handleChat("Chat")}>
        <ContactSupportIcon className={styles.icon} /> 
        <span className={styles.contact}>
          Contacts
        </span>
      </div>
    }
    <ContinuousSlider />
  </footer>
  )
}
export default Footer;