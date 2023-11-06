import React, { createContext, useContext, useState, ReactNode } from 'react';

type SharedData = {
  page: string;
  menu: string;
  chat: string;
  coords: { coordX: number; coordY: number };
  scroll: { scrollX: number; scrollY: number };
  updatePage: (newData: string) => void;
  updateMenu: (updateMenu: string) => void;
  updateChat: (updateChat: string) => void;
  updatePageMenuChat: (newData:string, newData2: string, newData3: string) => void;
  updateCoords: (newCoords: { coordX: number; coordY: number }) => void;
  updateScroll: (newScroll: { scrollX: number; scrollY: number }) => void;
};

const MyContext = createContext<SharedData | undefined>(undefined);

type MyProviderProps = {
  children: ReactNode;
};

function MyProvider({ children }: MyProviderProps) {
  const [sharedData, setSharedData] = useState({
    page:'Project',
    menu:'none',
    chat:'none',
    coords: { coordX: 0, coordY: 0 },
    scroll: { scrollX: 0, scrollY: 0 },
  });

  const updatePage = (newData: string) => {
    setSharedData({ ...sharedData, page: newData });
  };
  const updateMenu = (newData: string) => {
    setSharedData({ ...sharedData, menu: newData });
  };
  const updateChat = (newData: string) => {
    setSharedData({ ...sharedData, chat: newData });
  };
  const updatePageMenuChat = (newPage: string, newMenu: string, newChat: string) => {
    setSharedData({ ...sharedData, page: newPage, menu: newMenu, chat: newChat });
  };
  const updateCoords = (newCoords: { coordX: number; coordY: number }) => {
    setSharedData({ ...sharedData, coords: { ...newCoords } });
  };
  const updateScroll = (newScroll: { scrollX: number; scrollY: number }) => {
    setSharedData({ ...sharedData, scroll: { ...newScroll } });
  };
  

  return (
    <MyContext.Provider value={{ ...sharedData, updatePage, updateMenu, updateChat, updatePageMenuChat, updateCoords, updateScroll}}>
      {children}
    </MyContext.Provider>
  );
}

export { MyProvider, MyContext };