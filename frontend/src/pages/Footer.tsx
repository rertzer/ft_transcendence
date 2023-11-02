import { Tooltip } from '@mui/material'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import styles from "./Footer.module.css";import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';

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

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <div className={styles.slidder}>
      <Box sx={{ width: 200, height: 20 }}>
        <Stack spacing={0.5} direction="row" sx={{ mb: 1 }} alignItems="center">
          <RemoveCircleOutlineIcon fontSize='small' style={{color:'#AAAAAA', position:'relative', top:'0.5px', height:'14px'}}/>
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
          <ControlPointIcon fontSize='small' style={{color:'#AAAAAA', position:'relative', top:'0.5px', height:'14px'}}/>
        </Stack>
      </Box>
    </div>
    
  );
}

function Footer(Chat : string, setChat: any) {
  return (
	<footer className={styles.bottom} >
    {
      Chat === "Chat" ?
      <div className={styles.button} onClick={() => setChat("none")}>
       <ContactSupportIcon className={styles.icon} /> 
        <span className={styles.contact}>
          Contacts
        </span>
      </div> :
      <div className={styles.button} onClick={() => setChat("Chat")}>
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