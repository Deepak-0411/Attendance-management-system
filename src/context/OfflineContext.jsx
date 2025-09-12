import React, { createContext, useContext, useState } from "react";

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [offline, setOffline] = useState(false);
  const [retryFn, setRetryFn] = useState(null);

  return (
    <OfflineContext.Provider value={{ offline, setOffline, retryFn, setRetryFn }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
