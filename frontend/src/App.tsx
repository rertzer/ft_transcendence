import { useContext, useEffect } from 'react';
import './styles.scss';
import { createBrowserRouter, createRoutesFromElements,RouterProvider, Route } from 'react-router-dom';
import Login from './routes/FtLogin';
//import Login from './routes/Login';
import Profile from './routes/Profile';
import { WebsocketContext } from './context/chatContext';
import Desktop1 from './pages/Desktop1';
import Welcome from "./routes/Welcome";
import { LoginProvider } from "./components/user/auth";
import { RequireAuth } from "./components/user/requireAuth";
import EditProfile from "./routes/EditProfile";
import Twofa from './routes/TwoFA';
import Redirect from './routes/Redirect';
import RedirectTfa from './routes/RedirectTfa';

function App() {
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    console.log("rkeklkrer");
    socket.connect();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
	  <Route path="/" element={<RequireAuth><Desktop1 /></RequireAuth>} >
      </Route>
	  <Route path="/login" element={<Login />} />
    <Route path="/redirect" element={<Redirect />} /> 
    <Route path="/redirect/twofa" element={<RedirectTfa />} /> 
    <Route path="/profile" element={<RequireAuth> <Profile /></RequireAuth>} />
    <Route path="/edit" element={<RequireAuth> <EditProfile /></RequireAuth>} />
    <Route path="/twofa" element={<RequireAuth> <Twofa /></RequireAuth>} />
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
