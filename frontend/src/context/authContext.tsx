import React, { createContext, useContext, useEffect, useState } from "react";
import ChatContext from "../context/chatContext";
import chatContext from "../context/chatContext";
import  ConnectionContext from "./authContext"

export interface IConnected {
	login: string,
	setLogin: (login: string) => void,
	password: string,
	setPassword: (password: string) => void
}

const defaultState:IConnected = {
	login: '',
	setLogin: () => {},
	password: '',
	setPassword: () => {},
}

export default React.createContext(defaultState);