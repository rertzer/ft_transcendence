import './styles.scss';
import { createBrowserRouter, createRoutesFromElements,RouterProvider, Route } from 'react-router-dom';
// import Login from './routes/FtLogin';
import Login from './routes/Login';
import Profile from './components/Sheets/Profile/Profile';
import Desktop1 from './pages/Desktop1';
import Welcome from "./routes/Welcome";
import { LoginProvider } from "./components/user/auth";
import { RequireAuth } from "./components/user/requireAuth";
import EditProfile from "./routes/EditProfile";
import Twofa from './routes/TwoFA';
import Redirect from './routes/Redirect';
import RedirectTfa from './routes/RedirectTfa';
import { PageUrlProvider } from './context/PageUrlContext';
import { PageProvider } from './context/PageContext';

function App() {
 
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route>
	    <Route path="/" element={<RequireAuth><PageUrlProvider page_url={"Profile"}><Desktop1 /></PageUrlProvider></RequireAuth>} />
      <Route path="/game" element={<RequireAuth><PageUrlProvider page_url={"Game"}><Desktop1 /></PageUrlProvider></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><PageUrlProvider page_url={"Profile"}><Desktop1 /></PageUrlProvider></RequireAuth>} />
      <Route path="/profile/:login_url" element={<RequireAuth><PageUrlProvider page_url={"Profile"}><Desktop1 /></PageUrlProvider></RequireAuth>} />
      <Route path="/profile/edit" element={<RequireAuth> <EditProfile /></RequireAuth>} />
      <Route path="/data" element={<RequireAuth><PageUrlProvider page_url={"Data"}><Desktop1 /></PageUrlProvider></RequireAuth>} />
      <Route path="/contacts" element={<RequireAuth><PageUrlProvider page_url={"Contacts"}><Desktop1 /></PageUrlProvider></RequireAuth>} />
      <Route path="/login" element={<Login />} />
      <Route path="/redirect" element={<Redirect />} /> 
      <Route path="/redirect/twofa" element={<RedirectTfa />} /> 
      <Route path="/twofa" element={<RequireAuth> <Twofa /></RequireAuth>} />
      <Route path="*" element={<Welcome />} />
	  </Route>
    )
  );


  return (
    <div >
      <LoginProvider>
        <PageProvider>
          <RouterProvider router={router} />
        </PageProvider>
      </LoginProvider>
    </div>
  );
}

export default App;
