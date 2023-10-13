import React from 'react';
import './styles.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Chat from "./routes/Chat";
import Friends from "./routes/Friends";
import Game from "./routes/Game";
import Leaderboard from './routes/Leaderboard';
import Profile from './routes/Profile';
import Home from './routes/Home';

function App() {
  return (
    <div >
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/chat" element={<Chat />}/>
          <Route path="/friends" element={<Friends />}/>
          <Route path="/game" element={<Game />}/>
          <Route path="/leaderboard" element={<Leaderboard />}/>
          <Route path="/profile" element={<Profile />}/>
        </Routes>
        <Navbar />
    </div>
  );
}

export default App;