import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext({
    hiddenChat: true,
    toggle: () => {},
});

export const ChatContextProvider = ({children}: {children: React.ReactNode}) => {
    const [hiddenChat, setHiddenChat] = useState(true);

        const toggle = () => {
            setHiddenChat(!hiddenChat);
        }

    return (
        <ChatContext.Provider value={{hiddenChat, toggle}}>
            {children}
        </ChatContext.Provider>
    )
};