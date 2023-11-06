import React, { useContext, useState, useEffect } from 'react';
import styles from "./Header.module.css";
import style from "./SelectBar.module.css"
import { SelectBarItem } from './SelectBar/SelectBarItem';
import { MyContext } from '../../context/PageContext';


import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
// import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

import { ThemeProvider, createTheme } from '@mui/material/styles';
//import CssBaseline from '@mui/material/CssBaseline';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { isWhiteSpaceLike } from 'typescript';
import { withTheme } from '@emotion/react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
//import ListItemText from '@mui/material/ListItemText';

function BasicMenu() {
  function  File() {
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: 'white',}} style={{position: 'fixed', top:'64px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: '#2f2f2f', border:'1px solid black'}} >
        <ListItem button>
          <ListItemText onClick={() => handlePage("Project")}>New Project</ListItemText>
        </ListItem>
        <ListItem button onClick={() => handlePage("Profile")}><ListItemText>Profile </ListItemText></ListItem>
        <ListItem button onClick={() => handlePage("Data")}><ListItemText>Data </ListItemText></ListItem>
        <ListItem button onClick={() => handlePage("Contacts")}><ListItemText>Contacts </ListItemText></ListItem>
        <Divider/>
        <ListItem button onClick={() => handleChat("Chat")}><ListItemText>Toggle Chat </ListItemText></ListItem>
        <Divider/>
        <ListItem button><ListItemText>Print </ListItemText></ListItem>
        <ListItem button><ListItemText>Logout </ListItemText></ListItem>
        <ListItem button><ListItemText>Exit PongOffice </ListItemText></ListItem>
      </List>
    );
  }
  function  Edit() {
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: 'white',}} style={{position: 'fixed', top:'64px', left:'45px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: '#2f2f2f', border:'1px solid black'}} >
        <ListItem button>
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
        <ListItem button><ListItemText>Select All </ListItemText></ListItem>
        <ListItem button><ListItemText>Select Row </ListItemText></ListItem>
        <ListItem button><ListItemText>Select Column </ListItemText></ListItem>
      </List>
    );
  }
  function  View() {
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: 'white',}} style={{position: 'fixed', top:'64px', left:'90px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: '#2f2f2f', border:'1px solid black'}} >
        <ListItem button><CheckBoxOutlineBlankIcon fontSize="small"/><ListItemText style={{position:'relative', left:'10px'}}>Toolbar </ListItemText></ListItem>
        <Divider/>
        <ListItem button><ZoomInIcon/><ListItemText style={{position:'relative', left:'10px'}}>Zoom In </ListItemText></ListItem>
        <ListItem button><ZoomOutIcon/><ListItemText style={{position:'relative', left:'10px'}}>Zoom Out </ListItemText></ListItem>
      </List>
    );
  }
  function  Styles() {
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: 'white',}} style={{position: 'fixed', top:'64px', left:'135px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: '#2f2f2f', border:'1px solid black'}} >
        <ListItem button><RadioButtonUncheckedIcon style={{height:'15px'}}/><ListItemText style={{position:'relative', left:'10px'}}>Light </ListItemText></ListItem>
        <ListItem button><RadioButtonCheckedIcon style={{height:'15px'}}/><ListItemText style={{position:'relative', left:'10px'}}>Dark </ListItemText></ListItem>
      </List>
    );
  }
  function  Window() {
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: 'white',}} style={{position: 'fixed', top:'64px', left:'190px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: '#2f2f2f', border:'1px solid black'}} >
        <ListItem button><ListItemText>New Window </ListItemText></ListItem>
        <ListItem button><ListItemText>New Private Window </ListItemText></ListItem>
        <Divider/>
        <ListItem button><ListItemText>Close Window </ListItemText></ListItem>
      </List>
    );
  }function  Help() {
    return (
      <List dense onMouseLeave={() => handleClick("none")} sx={{color: 'white',}} style={{position: 'fixed', top:'64px', left:'255px', width:200, paddingTop: "0px", paddingBottom: "0px", backgroundColor: '#2f2f2f', border:'1px solid black'}} >
        <ListItem button><PsychologyAltIcon fontSize="small"/><ListItemText style={{position:'relative', left:'10px'}}>What's this ? </ListItemText></ListItem>
        <ListItem button><KeyboardIcon fontSize="small"/><ListItemText style={{position:'relative', left:'10px'}}>Controls </ListItemText></ListItem>
        <Divider/>
        <ListItem button><InfoIcon fontSize="small"/><ListItemText style={{position:'relative', left:'10px'}}>About us </ListItemText ></ListItem>
      </List>
    );
  }
  function BarSwitch () {
      const context = useContext(MyContext);
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
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { page, menu, chat, updatePageMenuChat, updatePage, updateMenu, updateChat } = context;
  function handleClick(str : string) {
    updateMenu(str);
    console.log("clicked");
  }
  function handlePage(str : string) {
    updatePageMenuChat(str, "none", chat);
  }
  function handleChat(str : string) {
    if (str == chat)
      updatePageMenuChat(page, "none", "none");
    else
      updatePageMenuChat(page, "none", str);
  }
  const darkTheme = createTheme({
    palette: {
      text: {
        primary: '#FFFFFF',
        secondary: '#FFFFFF',
        disabled: 'grey',
      },
      action: {
        active: 'white',
        selected: 'white',
        disabledBackground: 'white',
        hover: '#15539e',
        disabled: 'white',
      },
      background: {
        default: '#2f2f2f',
        paper: '#2f2f2f',
      },
      divider: '#1a1a1a',
    },
  });
  const divStyle = {
    left: '0px',
    width: '45px',
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={style.file} style={{left: '0px',width: '45px'}} onMouseEnter={() => handleClick("File")}>
        <div className={style.file1} style={{width: '45px'}}>File</div>
      </div>
      <div className={style.file} style={{left: '45px',width: '45px'}} onMouseEnter={() => handleClick("Edit")}>
        <div className={style.file1} style={{width: '45px',}}>Edit</div>
      </div>
      <div className={style.file} style={{left: '90px',width: '45px'}} onMouseEnter={() => handleClick("View")}>
        <div className={style.file1} style={{width: '45px',}}>View</div>
      </div>
      <div className={style.file} style={{left: '135px',width: '55px'}} onMouseEnter={() => handleClick("Styles")}>
        <div className={style.file1} style={{width: '55px',}}>Styles</div>
      </div>
      <div className={style.file} style={{left: '190px',width: '65px'}} onMouseEnter={() => handleClick("Window")}>
        <div className={style.file1} style={{width: '65px',}}>Window</div>
      </div>
      <div className={style.file} style={{left: '255px',width: '45px'}} onMouseEnter={() => handleClick("Help")}>
        <div className={style.file1} style={{width: '45px',}}>Help</div>
      </div>
      {BarSwitch()}
    </ThemeProvider>
  );
}

export function SelectBar({}) {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useContext must be used within a MyProvider');
  }
  const { menu, updateMenu } = context;
  function handleClick(str : string) {
    updateMenu(str);
  }

  const darkTheme = createTheme({
    palette: {
      text: {
        primary: 'white',
        secondary: 'white',
        disabled: 'white',
      },
      action: {
        active: 'grey',
        selected: 'grey',
        disabledBackground: 'grey',
        hover: '#3584e4',
        disabled: 'grey',
      },
      background: {
        default: '#2f2f2f',
        paper: '#2f2f2f',
      },
      divider: '#2a2a2a',
    },
  });
  return <div>
          <div className={styles.textBar}>
            <div className={styles.textBar1} onMouseEnter={() => handleClick("none")}/>
            {/* <SelectBarItem labelText="File" left="0px" width='40px' /> */}
            <BasicMenu />
            {/* <SelectBarItem labelText="Edit" left="40px" width='45px' />
            <SelectBarItem labelText="View" left="85px" width='45px' />
            <SelectBarItem labelText="Styles" left="130px" width='50px' />
            <SelectBarItem labelText="Window" left="180px" width='65px' /> */}
            {/* <SelectBarItem labelText="Help" left="245px" width='45px' /> */}
          </div>
          {/* <ThemeProvider theme={darkTheme}>
            <Paper sx={{ position:'fixed', top:'65px' ,width: 320, maxWidth: '100%'}} >
                <MenuList dense>
                  <MenuItem >
                    <ListItemIcon>
                      <ContentCut fontSize="small" style={{color:"white"}}/>
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘X
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCopy fontSize="small" style={{color:"white"}}/>
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘C
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentPaste fontSize="small" style={{color:"white"}}/>
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘V
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem > 
                    <ListItemIcon>
                      <Cloud fontSize="small" style={{color:"white"}}/>
                    </ListItemIcon>
                    <ListItemText>Web Clipboard</ListItemText>
                  </MenuItem>
                </MenuList>
              </Paper>
            </ThemeProvider> */}
          </div>;
}