import React, { createContext, useState, ReactNode } from 'react';

type SharedData = {
  page: string;
  menu: string;
  chat: string;
  zoom: number;
  toolbar: boolean;
  dark: boolean;
  coords: { coordX: number; coordY: number };
  scroll: { scrollX: number; scrollY: number };
  game: { player1: string; player2: string; points1: number; points2: number};
  updatePage: (page: string) => void;
  updateMenu: (menu: string) => void;
  updateChat: (chat: string) => void;
  updateZoom: (zoom: number) => void;
  updateToolbar: (newTool: boolean) => void;
  updateDark: (newDark: boolean) => void;
  updatePageMenuChat: (page:string, menu: string, chat: string) => void;
  updateCoords: (newCoords: { coordX: number; coordY: number }) => void;
  updateCoordsMenu: (newCoords: { coordX: number; coordY: number }, newMenu: string) => void;
  updateScroll: (newScroll: { scrollX: number; scrollY: number }) => void;
  updateGame: (newGame: { player1: string; player2: string; points1: number; points2: number}) => void;
};

const PageContext = createContext<SharedData | undefined>(undefined);

type MyProviderProps = {
  children: ReactNode;
  page_url: string;
};

function PageProvider({ children, page_url }: MyProviderProps) {
  const [sharedData, setSharedData] = useState({
    page: page_url,
    menu:'none',
    chat:'none',
    zoom:125,
    toolbar:false,
    dark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    coords: { coordX: 0, coordY: 0 },
    scroll: { scrollX: 0, scrollY: 0 },
    game: {player1: "player1", player2: "player2", points1: 0, points2: 0},
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
  const updateDark = (newDark: boolean) => {
    setSharedData({ ...sharedData, dark: newDark });
  };
  const updatePageMenuChat = (newPage: string, newMenu: string, newChat: string) => {
    setSharedData({ ...sharedData, page: newPage, menu: newMenu, chat: newChat});
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
  const updateGame = (newGame: { player1: string; player2: string; points1: number; points2: number}) => {
    setSharedData({ ...sharedData, game: { ...newGame } });
  };
  

  return (
    <PageContext.Provider value={{ ...sharedData, updatePage, updateMenu, updateChat, updateZoom, updateToolbar, updateDark, updatePageMenuChat, updateCoords, updateCoordsMenu, updateScroll, updateGame}}>
      {children}
    </PageContext.Provider>
  );
}

export { PageProvider, PageContext };