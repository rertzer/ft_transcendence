import React, { createContext, useContext, useEffect, useState } from "react";
import ChatContext from "../context/chatContext";
import chatContext from "../context/chatContext";
import  ConnectionContext from "./authContext"
// export const AuthContext = createContext({
//     currentUser: {
//         id: 0,
//         name:"toto",
//         profilePic: ""
//     },
//     login: () => {},
// });

export interface IConnected {
	username: string,
	setUsername: (username: string) => void;
}

const defaultState:IConnected = {
	username: '',
	setUsername: () => {},
}

export default React.createContext(defaultState);

// export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {

// 	const {username, setUsername} = useContext(ConnectionContext)
//     //     JSON.parse(localStorage.getItem("user") || '{}') || null
//     // );


//         const login = () => {
// 			if (username !== '')
// 			{
// 			}
//         }

// useEffect(() => {
//     localStorage.setItem("user", JSON.stringify(username));
// }, [username]);

//     return (
//         <AuthContext.Provider value={{username, login}}>
//             {children}
//         </AuthContext.Provider>
//     )
// };
