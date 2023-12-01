import { useState, useContext, createContext, useEffect } from "react";

const LoginContext = createContext<any>(null);

export const LoginProvider = ({ children }: any) => {
  ////////////////////////////////////////// state //////////////////////////////////////////////////////
  const raw_token: string | null = sessionStorage.getItem("Token");
  let token = { login: "", access_token: "" };
  if (raw_token) token = JSON.parse(raw_token);

  const empty_user = {
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    login: "",
    email: "",
    avatar: "",
    role: "",
    password: "",
    game_won: 0,
    game_lost: 0,
    game_played: 0,
  };
  const [user, setUser] = useState(empty_user);
  console.log("Inside Login Provider");
  const [image, setImage] = useState("norminet.jpeg");

  //////////////////////////////////////// Functions ///////////////////////////////////////////////////
  const login = (raw_token: any) => {
    sessionStorage.setItem("Token", JSON.stringify(raw_token));
    token = raw_token;
    setImage("norminet.jpeg");
    reload();
  };

  const logout = () => {
    console.log("Logging out");
    sessionStorage.setItem("Token", "");
    token = { login: "", access_token: "" };
    setImage("");
    setUser(empty_user);
  };

  const fetchImage = async () => {
    const bearer = "Bearer " + token.access_token;
    const res = await fetch(
      `http://${process.env.REACT_APP_URL_MACHINE}:4000/user/avatar/` +
        user.avatar,
      {
        method: "GET",
        headers: { Authorization: bearer },
      }
    );
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImage(imageObjectURL);
  };

  const reload = () => {
    if (token.login) {
      const bearer = "Bearer " + token.access_token;
      const fetchUser = async () => {
        console.log("bearer is", bearer);
        fetch(
          `http://${process.env.REACT_APP_URL_MACHINE}:4000/user/` +
            token.login,
          {
            method: "GET",
            headers: { Authorization: bearer },
          }
        )
          .then((response) => response.json())
          .then((data) => setUser(data))
          .catch((error) => console.log(error));
      };
         fetchUser();
    }
  };

  const edit = (user: any) => {
    setUser(user);
  };
  const getLogin = () => {
    return token.login;
  };

  const getBearer = () => {
    reload();
    return "Bearer " + token.access_token;
  };

  //////////////////////////////// refresh //////////////////////////////////////
  useEffect(() => {
    if (user.avatar) {
      try {
        fetchImage().catch((e) => console.log("Failed to fetch the avatar"));
      } catch (e) {
        console.log(e);
      }
    }
  }, [user]);

  if (!user.login) reload();

  return (
    <LoginContext.Provider
      value={{ user, image, login, logout, getLogin, getBearer, edit }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  return useContext(LoginContext);
};
