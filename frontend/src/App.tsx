import React, { useContext, useState, useEffect } from "react";
import "./styles.scss";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import UserContext from "./context/userContext";
import { IContextUser } from "./context/userContext";
import Desktop1 from "./pages/Desktop1";
import Game from "./components/game/Game";
import { WebsocketContext } from "./context/chatContext";
import Welcome from "./routes/Welcome";
import { LoginProvider } from "./components/user/auth";
import { RequireAuth } from "./components/user/requireAuth";
import EditProfile from "./routes/EditProfile";

function App() {
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    console.log("rkeklkrer");
    socket.connect();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
        <Route path="*" element={<Welcome />} />
      </Route>
    )
  );

  return (
    <div>
      <LoginProvider>
        <RouterProvider router={router} />
      </LoginProvider>
    </div>
  );
}

export default App;
