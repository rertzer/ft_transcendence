import React, { createContext, useContext, useEffect, useState } from "react";

export interface IUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  avatar: string;
  role: string;
  password: string;
  game_won: number;
  game_lost: number;
  game_played: number;
}

export interface IContextUser {
  user: IUser;
  setUser: (user: IUser) => void;
}

const defaultState: IContextUser = {
  user: {
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
  },
  setUser: () => {},
};

export default React.createContext(defaultState);
