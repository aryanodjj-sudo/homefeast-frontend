import { createContext, useCallback, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { getStorageItem, setStorageItem, removeStorageItem } from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // IMPORTANT: user and token are both read/written through storage.js's
  // getStorageItem/setStorageItem (which JSON.stringify/JSON.parse under the
  // hood), never through raw localStorage.setItem/getItem directly.
  // Mixing the two was the root cause of the "token needed" bug: writing the
  // token with a plain localStorage.setItem stored it as an unquoted string,
  // but api.js's request() reads it back with getStorageItem (JSON.parse) -
  // JSON.parse on a raw JWT throws, so the token always came back as null
  // and no request ever carried an Authorization header, even right after login.
  const [user, setUser] = useState(() => getStorageItem(STORAGE_KEYS.USER, null));
  const [token, setToken] = useState(() => getStorageItem(STORAGE_KEYS.TOKEN, null));
  const [loading, setLoading] = useState(false);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      setStorageItem(STORAGE_KEYS.USER, nextUser);
    } else {
      removeStorageItem(STORAGE_KEYS.USER);
    }
  };

  const persistToken = (nextToken) => {
    setToken(nextToken);
    if (nextToken) {
      setStorageItem(STORAGE_KEYS.TOKEN, nextToken);
    } else {
      removeStorageItem(STORAGE_KEYS.TOKEN);
    }
  };

  const login = useCallback(({ user: loggedInUser, token: newToken }) => {
    persistUser(loggedInUser);
    persistToken(newToken);
  }, []);

  const logout = useCallback(() => {
    persistUser(null);
    persistToken(null);
  }, []);

  // Used by the Profile page after a successful authAPI.updateProfile call -
  // patches the locally-held user (and storage) without touching the session token.
  const updateUser = useCallback((updatedUser) => {
    persistUser(updatedUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      setLoading,
      login,
      logout,
      updateUser,
      isAuthenticated: !!token,
    }),
    [user, token, loading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;