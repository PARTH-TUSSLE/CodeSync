import React, { PropsWithChildren } from 'react'
import { useContext, createContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function useAuth () {
  return useContext(AuthContext);
}

export function AuthProvider ({children}: PropsWithChildren) {
  const [currUser, setCurrUser] = useState<string | null>(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrUser(userId);
    }
  }, []);
  const value = {
    currUser, setCurrUser
  }
  return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>
}