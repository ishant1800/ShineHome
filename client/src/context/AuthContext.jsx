import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const GUEST_FAVS_KEY = 'shinehome_guest_favorites';
const TOKEN_KEY = 'shinehome_token';
const USER_KEY = 'shinehome_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [guestFavorites, setGuestFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(GUEST_FAVS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then(({ user: fetchedUser }) => {
        setUser(fetchedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const favorites = user ? (user.favorites || []).map(String) : guestFavorites;

  function saveAuthSession(token, userData) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email, password) {
    const { token, user: loggedUser } = await api.login({ email, password });
    saveAuthSession(token, loggedUser);
    return loggedUser;
  }

  async function register(name, email, password) {
    const { token, user: createdUser } = await api.register({ name, email, password });
    saveAuthSession(token, createdUser);
    return createdUser;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  async function toggleFavorite(designId) {
    const idStr = String(designId);
    if (user) {
      const { favorites: updatedFavs } = await api.toggleDesignFavorite(idStr);
      const nextUser = { ...user, favorites: updatedFavs };
      setUser(nextUser);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      return updatedFavs.map(String).includes(idStr);
    }

    const exists = guestFavorites.includes(idStr);
    const nextGuest = exists
      ? guestFavorites.filter((id) => id !== idStr)
      : [...guestFavorites, idStr];
    setGuestFavorites(nextGuest);
    localStorage.setItem(GUEST_FAVS_KEY, JSON.stringify(nextGuest));
    return !exists;
  }

  function isFavorited(designId) {
    return favorites.includes(String(designId));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        favorites,
        isFavorited,
        toggleFavorite,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
