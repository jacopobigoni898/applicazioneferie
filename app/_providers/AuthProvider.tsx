import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { fetchMicrosoftLogin } from "../../src/api/authApi";
import {
  authStorage,
  AuthSessionData,
} from "../../src/core/auth/authStorage";
import { setUnauthorizedHandler } from "../../src/api/httpClient";
import {
  refreshMicrosoftToken,
  signInWithMicrosoft,
} from "../../src/core/auth/authService";
import { useAuthGuard } from "../../src/core/auth/useAuthGuard";
import type { User } from "../../src/domain/entities/User";

//definisce a forma del oggeto di autenticazione fornito da AuthProvider
type AuthContextType = {
  user: User | null; // id profilo del utente corrente o null in caso non sia connesso
  accessToken: string | null;
  isLoading: boolean; // carica token da storage
  isUserLoading: boolean; // carica profilo utente
  refreshUser: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

//creo il contesto cosi tutti possono recuperarlo
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<AuthSessionData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const accessToken = session?.accessToken ?? null;

  const isSessionExpired = useCallback((s: AuthSessionData | null) => {
    if (!s?.expiresAt) return false;
    // margine 30s per evitare richieste con token quasi scaduto
    return Date.now() >= s.expiresAt - 30_000;
  }, []);

  const ensureFreshSession = useCallback(
    async (current: AuthSessionData | null): Promise<AuthSessionData | null> => {
      if (!current) return null;
      if (!isSessionExpired(current)) return current;

      if (!current.refreshToken) return null;

      const refreshed = await refreshMicrosoftToken(current.refreshToken);
      if (!refreshed) return null;

      await authStorage.setSession(refreshed);
      return refreshed;
    },
    [isSessionExpired],
  );
  const refreshUser = useCallback(async () => {
    if (!accessToken) return;
    setIsUserLoading(true);
    try {
      const profile = await fetchMicrosoftLogin();
      setUser(profile);
    } catch (error) {
      console.error("Errore nel recupero profilo", error);
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  }, [accessToken]);

  //provo a vedere se ce gia un access token salvato nello sceurestorage
  useEffect(() => {
    const loadToken = async () => {
      try {
        const stored = await authStorage.getSession();
        if (stored) {
          const fresh = await ensureFreshSession(stored);

          if (fresh) {
            if (__DEV__) {
              console.log("[AuthProvider] sessione caricata da storage", fresh);
            }
            setSession(fresh);
          } else {
            await authStorage.deleteSession();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, [ensureFreshSession]);

  // Quando ho un token, provo a recuperare il profilo utente
  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }
    refreshUser();
  }, [accessToken, refreshUser]);

  useAuthGuard(accessToken, isLoading, isUserLoading);

  const signIn = async () => {
    try {
      const newSession = await signInWithMicrosoft();
      if (!newSession) return; // login cancellato o fallito

      if (__DEV__) {
        console.log("[AuthProvider] token ricevuto da login:", newSession);
      }
      await authStorage.setSession(newSession);
      setSession(newSession);
    } catch (error) {
      console.error("Errore durante il login", error);
    }
  };

  const signOut = useCallback(async () => {
    await authStorage.deleteSession();
    setSession(null);
    setUser(null);
  }, []);

  // refresh silenzioso prima della scadenza del token, altrimenti logout
  useEffect(() => {
    if (!session) return;
    if (!session.expiresAt) return;

    const now = Date.now();
    const refreshIn = session.expiresAt - now - 30_000; // 30s di margine
    const delay = Math.max(refreshIn, 0);

    const timer = setTimeout(async () => {
      const fresh = await ensureFreshSession(session);
      if (fresh) {
        setSession(fresh);
        await authStorage.setSession(fresh);
      } else {
        await signOut();
        Alert.alert("Sessione scaduta", "Accedi nuovamente per continuare.");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [session, ensureFreshSession, signOut]);

  // Registra handler globale: se un 401 arriva dagli interceptor, puliamo lo stato
  useEffect(() => {
    setUnauthorizedHandler(() => {
      Alert.alert(
        "Sessione scaduta",
        "Per favore accedi di nuovo per continuare.",
      );
      setSession(null);
      setUser(null);
      authStorage.deleteSession();
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      accessToken,
      isLoading,
      isUserLoading,
      refreshUser,
      signIn,
      signOut,
    }),
    [user, accessToken, isLoading, isUserLoading, refreshUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve essere usato all'interno di AuthProvider");
  }
  return ctx;
};

// Default export to silence Expo Router route warning
export default AuthProvider;
