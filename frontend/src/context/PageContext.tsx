import React, { createContext, useState, ReactNode } from 'react';

type SharedData = {
  page: string;
  menu: string;
  chat: string;
  zoom: number;
  toolbar: boolean;
  coords: { coordX: number; coordY: number };
  scroll: { scrollX: number; scrollY: number };
  updatePage: (newData: string) => void;
  updateMenu: (updateMenu: string) => void;
  updateChat: (updateChat: string) => void;
  updateZoom: (newZoom: number) => void;
  updateToolbar: (newTool: boolean) => void;
  updatePageMenuChat: (newData:string, newData2: string, newData3: string) => void;
  updateCoords: (newCoords: { coordX: number; coordY: number }) => void;
  updateCoordsMenu: (newCoords: { coordX: number; coordY: number }, newMenu: string) => void;
  updateScroll: (newScroll: { scrollX: number; scrollY: number }) => void;
};

const MyContext = createContext<SharedData | undefined>(undefined);

type MyProviderProps = {
  children: ReactNode;
};

function MyProvider({ children }: MyProviderProps) {
  const [sharedData, setSharedData] = useState({
    page:'Profile',
    menu:'none',
    chat:'none',
    zoom:125,
    toolbar:false,
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
  const updateZoom = (newData: number) => {
    setSharedData({ ...sharedData, zoom: newData });
  };
  const updateToolbar = (newData: boolean) => {
    setSharedData({ ...sharedData, toolbar: newData });
  };
  const updatePageMenuChat = (newPage: string, newMenu: string, newChat: string) => {
    setSharedData({ ...sharedData, page: newPage, menu: newMenu, chat: newChat });
  };
  const updateCoords = (newCoords: { coordX: number; coordY: number }) => {
    setSharedData({ ...sharedData, coords: { ...newCoords } });
  };

  const updateCoordsMenu = (newCoords: { coordX: number; coordY: number }, newMenu: string) => {
    setSharedData({ ...sharedData, coords: { ...newCoords }, menu: newMenu});
  };
  const updateScroll = (newScroll: { scrollX: number; scrollY: number }) => {
    setSharedData({ ...sharedData, scroll: { ...newScroll } });
  };
  

  return (
    <MyContext.Provider value={{ ...sharedData, updatePage, updateMenu, updateChat, updateZoom, updateToolbar, updatePageMenuChat, updateCoords, updateCoordsMenu, updateScroll}}>
      {children}
    </MyContext.Provider>
  );
}

export { MyProvider, MyContext };