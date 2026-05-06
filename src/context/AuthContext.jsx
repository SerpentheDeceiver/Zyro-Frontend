import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../api';
import { TOKEN_KEY, USER_KEY } from '../api/client';
import { USE_MOCK } from '../api/config';
import { buildUserFromAuth } from '../utils/auth';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await authAPI.getCurrentUser();
    persistUser(profile);
    return profile;
  }, [persistUser]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authAPI.getCurrentUser();
        if (!cancelled) persistUser(profile);
      } catch {
        if (!cancelled) {
          setToken(null);
          persistUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [persistUser, token]);

  const sendOTP = useCallback(async (mobile) => {
    await authAPI.sendOTP(mobile);
    toast.success('OTP sent');
  }, []);

  const setSession = useCallback(
    (nextUser, nextToken = 'mock-access-token') => {
      if (nextToken) {
        localStorage.setItem(TOKEN_KEY, nextToken);
        setToken(nextToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
      persistUser(nextUser || null);
    },
    [persistUser]
  );

  const verifyOTP = useCallback(
    async (mobile, otp) => {
      const authResponse = await authAPI.verifyOTP(mobile, otp);
      const nextToken = authResponse.token || authResponse.accessToken || (USE_MOCK ? 'mock-access-token' : null);
      if (!nextToken) {
        throw new Error('OTP verified but no access token was returned.');
      }
      localStorage.setItem(TOKEN_KEY, nextToken);
      setToken(nextToken);

      if (USE_MOCK) {
        persistUser(authResponse.user || buildUserFromAuth(authResponse));
        toast.success('Welcome to Zyro');
        return authResponse;
      }

      persistUser(authResponse.user || buildUserFromAuth(authResponse));

      try {
        await refreshUser();
      } catch {
        // The auth response is enough to continue if profile hydration is delayed.
      }

      toast.success('Welcome to Zyro');
      return authResponse;
    },
    [persistUser, refreshUser]
  );

  const updateUser = useCallback(
    async (payload) => {
      const profile = await authAPI.updateProfile(payload);
      persistUser(profile);
      toast.success('Profile updated');
      return profile;
    },
    [persistUser]
  );

  const becomeSeller = useCallback(async () => {
    const profile = await authAPI.becomeSeller();
    persistUser(profile);
    toast.success('Seller access enabled');
    return profile;
  }, [persistUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      setSession,
      sendOTP,
      verifyOTP,
      refreshUser,
      updateUser,
      becomeSeller,
      logout,
    }),
    [becomeSeller, loading, logout, refreshUser, sendOTP, setSession, token, updateUser, user, verifyOTP]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
