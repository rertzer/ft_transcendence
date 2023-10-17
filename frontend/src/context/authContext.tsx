import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    currentUser: {
        id: 0,
        name:"",
        profilePic: ""
    },
    login: () => {},
});

export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user") || '{}') || null
    );

        const login = () => {
            setCurrentUser({
                id:1,
                name:"testName",
                profilePic: "https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg"
            });
        }

useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
}, [currentUser]);

    return (
        <AuthContext.Provider value={{currentUser, login}}>
            {children}
        </AuthContext.Provider>
    )
};