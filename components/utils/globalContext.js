import React, { useState } from "react";

export const GlobalContext = React.createContext();

export const GlobalStateProvider = ({ children }) => {
  const [userName, setUserName] = useState("");

  const state = {
    userName,
    setUserName,
  };

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};
