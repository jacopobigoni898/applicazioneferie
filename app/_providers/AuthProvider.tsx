import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { useRouter, useSegments } from "expo-router";
import { fetchMicrosoftLogin } from "../../src/api/authApi";
import type { User } from "../../src/domain/entities/User";

const CLIENT_ID = "37bdcadd-4948-4dff-9c60-a3d119fa4ab5"; //chi sei
const TENANT_ID = "b3c5783b-8e0b-4639-85b6-e17c2dabed5b"; //quale organizzazione microsoft contattare
const AUTH_SCOPES = [
  "api://37bdcadd-4948-4dff-9c60-a3d119fa4ab5/user_impersonation", //indicano cosa puo fare gli utenti
];

//definisce a forma del oggeto di autenticazione fornito da AuthProvider
type AuthContextType = {
  user: User | null; //profilo del utente corrente o null in caso non sia connesso
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
  const router = useRouter(); // oggeto di navigazione di expo per fare redirect
  const segments = useSegments(); // restituisce l array dei segmenti della route corrente

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
        const token = await SecureStore.getItemAsync("msal_access_token");
        if (token) {
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
  //quandoisn loadinf  finito controlla segment(la route) e controlla se hai il token altrimenti torni alla login
  useEffect(() => {
    if (isLoading) return;

    const inTabs = segments[0] === "(tabs)";
    const atLogin = segments[0] === "login";

    if (!accessToken && inTabs) {
      router.replace("/login");
    }

    if (accessToken && atLogin) {
      router.replace("/(tabs)");
    }
  }, [accessToken, isLoading, router, segments]);

  const signIn = async () => {
    try {
      const discovery = await AuthSession.fetchDiscoveryAsync(
        `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
      );

      // Use Expo proxy so it works from Expo Go QR (no dev client needed)
      const redirectUri = AuthSession.makeRedirectUri();
      console.log(redirectUri);

      const request = new AuthSession.AuthRequest({
        clientId: CLIENT_ID,
        scopes: AUTH_SCOPES,
        redirectUri,
        usePKCE: true,
      });

      // Proxy is enabled by default in Expo Go
      const result = await request.promptAsync(discovery);

      if (result.type === "success" && result.params.code) {
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: CLIENT_ID,
            code: result.params.code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier || "",
            },
          },
          discovery,
        );

        if (tokenResponse.accessToken) {
          console.log("Received access token", tokenResponse.accessToken);
          await SecureStore.setItemAsync(
            "msal_access_token",
            tokenResponse.accessToken,
          );
          setAccessToken(tokenResponse.accessToken);
        }
      } else {
        console.log("Login fallito o cancellato", result);
      }
    } catch (error) {
      console.error("Errore durante il login", error);
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("msal_access_token");
    setAccessToken(null);
    setUser(null);
  };

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
