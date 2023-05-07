import React, { useState } from "react";

export const GlobalContext = React.createContext();

export const GlobalStateProvider = ({ children }) => {
  const [userName, setUserName] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const state = {
    userName,
    setUserName,
    currentUserId,
    setCurrentUserId,
    currentSessionId,
    setCurrentSessionId,
  };

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};
