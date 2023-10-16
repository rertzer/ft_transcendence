import React from 'react';
import './styles.scss';
import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './routes/Login';
import Register from './routes/Register';
import Home from './routes/Home';
import Profile from './routes/Profile';
import Navbar from './components/Navbar';
import Leftbar from './components/Leftbar';
import Rightbar from './components/Rightbar';

function App() {

  let loggedInUser = true;

  const Layout = ()=> {
    return (
      <div>
        <Navbar />
        <div style={{display: "flex"}}>
          <Leftbar />
          <div style={{flex: 7}}>
            <Outlet />
          </div>
          <Rightbar />
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({children}: any) => {

    if (loggedInUser === false) {
      return (<Navigate to="/login" />);
    }
    return (children);
  }

  const router = createBrowserRouter([
    {
      path:"/",
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children:[
        {
          path:"/",
          element: <Home/>
        },
        {
          path:"/profile/:id",
          element: <Profile />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    }
  ]);
  return (
    <div >
        <RouterProvider router={router} />
    </div>
  );
}

export default App;