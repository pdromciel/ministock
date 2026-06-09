import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const token = await authService.getStoredToken();
        setUserToken(token);
      } catch (error) {
        setUserToken(null);
      } finally {
        setInitializing(false);
      }
    }
    loadToken();
  }, []);

  const signIn = useCallback(async (username, password) => {
    const result = await authService.login(username, password);
    setUserToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUserToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ userToken, user, initializing, signIn, signOut }), [userToken, user, initializing, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
