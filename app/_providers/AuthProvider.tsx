import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchMicrosoftLogin } from "../../src/api/authApi";
import { authStorage } from "../../src/core/auth/authStorage";
import { setUnauthorizedHandler } from "../../src/api/httpClient";
import { signInWithMicrosoft } from "../../src/core/auth/authService";
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(false);
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
        const token = await authStorage.getToken();
        if (token) {
          if (__DEV__) {
            console.log("[AuthProvider] token caricato da storage:", token);
          }
          setAccessToken(token);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

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
      const token = await signInWithMicrosoft();
      if (!token) return; // login cancellato o fallito

      if (__DEV__) {
        console.log("[AuthProvider] token ricevuto da login:", token);
      }
      await authStorage.setToken(token);
      setAccessToken(token);
    } catch (error) {
      console.error("Errore durante il login", error);
    }
  };

  const signOut = async () => {
    await authStorage.deleteToken();
    setAccessToken(null);
    setUser(null);
  };

  // Registra handler globale: se un 401 arriva dagli interceptor, puliamo lo stato
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAccessToken(null);
      setUser(null);
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
