import React from 'react';
import logo from './logo.svg';
import './App.css';
import {WebsocketProvider, socket } from './contexts/ChatContext';
import { Websocket, inChat } from './components/Websocket';
import { InChat } from './components/chat';

function App() {
  return (
	<ChatApp />
  );
}

export default App;
