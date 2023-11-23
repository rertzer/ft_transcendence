import { useContext, useEffect } from 'react';
import './styles.scss';
import { createBrowserRouter, createRoutesFromElements,RouterProvider, Route } from 'react-router-dom';
import Login from './routes/Login';
import Home from './routes/Home';
import Profile from './routes/Profile';
import { WebsocketContext } from './context/chatContext';
import Desktop1 from './pages/Desktop1';
import Game from './components/game/Game';
import Welcome from "./routes/Welcome";
import { LoginProvider } from "./components/user/auth";
import { RequireAuth } from "./components/user/requireAuth";
import EditProfile from "./routes/EditProfile";

function App() {
 

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
	  <Route path="/" element={<RequireAuth><Desktop1 /></RequireAuth>} >
		<Route path="/" element={<Home />} />
		<Route path="/" element={<Profile />} />
		<Route path="/" element={<Game />} />
      </Route>
	  <Route path="/login" element={<Login />} />
	  <Route path="*" element={<Welcome />} />
	  </Route>
    )
  );


  return (
    <div >
		<LoginProvider>
			<RouterProvider router={router} />
		</LoginProvider>
    </div>
  );
}

export default App;
