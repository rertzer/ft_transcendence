import React from 'react';
import logo from './logo.svg';
import './App.css';
import {WebsocketProvider, socket } from './contexts/websocketContext';
import { Websocket } from './components/Websocket';
function App() {
  return (
	<WebsocketProvider value={socket}>
		<Websocket />
	</WebsocketProvider>
  );
}

export default App;
