import React, { createContext, useEffect, useState } from 'react';

export const authContext = createContext();

export default function AuthContextProvider({ children }) {
  const [Token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('userToken');
    if (stored) setToken(stored);
    setLoading(false);
  }, []);

  return (
    <authContext.Provider value={{ Token, setToken, loading }}>
      {children}
    </authContext.Provider>
  );
}