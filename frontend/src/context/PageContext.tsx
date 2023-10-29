import React, { createContext, useContext, useState, ReactNode } from 'react';

type SharedData = {
  page: string;
  coords: { coordX: number; coordY: number };
  updatePage: (newData: string) => void;
  updateCoords: (newCoords: { coordX: number; coordY: number }) => void;
};

const MyContext = createContext<SharedData | undefined>(undefined);

type MyProviderProps = {
  children: ReactNode;
};

function MyProvider({ children }: MyProviderProps) {
  const [sharedData, setSharedData] = useState({
    page:'Project',
    coords: { coordX: 0, coordY: 0 },
  });

  const updatePage = (newData: string) => {
    setSharedData({ ...sharedData, page: newData });
  };
  const updateCoords = (newCoords: { coordX: number; coordY: number }) => {
    setSharedData({ ...sharedData, coords: { ...newCoords } });
  };
  

  return (
    <MyContext.Provider value={{ ...sharedData, updatePage, updateCoords}}>
      {children}
    </MyContext.Provider>
  );
}

export { MyProvider, MyContext };