import './styles.scss';
import { createBrowserRouter, createRoutesFromElements,RouterProvider, Route } from 'react-router-dom';
//import Login from './routes/FtLogin';
import Login from './routes/Login';
import Home from './routes/Home';
import Profile from './routes/Profile';
import Desktop1 from './pages/Desktop1';
import Game from './components/game/Game';
import Welcome from "./routes/Welcome";
import { LoginProvider } from "./components/user/auth";
import { RequireAuth } from "./components/user/requireAuth";
import EditProfile from "./routes/EditProfile";
import Twofa from './routes/TwoFA';
import Redirect from './routes/Redirect';
import RedirectTfa from './routes/RedirectTfa';
import { PageProvider } from './context/PageContext';

function App() {
 
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route>
	    <Route path="/" element={<RequireAuth><Desktop1 /></RequireAuth>} />
      <Route path="/game" element={<RequireAuth><PageProvider page_url={"Game"}><Desktop1 /></PageProvider></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><PageProvider page_url={"Profile"}><Desktop1 /></PageProvider></RequireAuth>} />
      <Route path="/data" element={<RequireAuth><PageProvider page_url={"Data"}><Desktop1 /></PageProvider></RequireAuth>} />
      <Route path="/contacts" element={<RequireAuth><PageProvider page_url={"Contacts"}><Desktop1 /></PageProvider></RequireAuth>} />
      <Route path="/login" element={<Login />} />
      <Route path="/redirect" element={<Redirect />} /> 
      <Route path="/redirect/twofa" element={<RedirectTfa />} /> 
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
