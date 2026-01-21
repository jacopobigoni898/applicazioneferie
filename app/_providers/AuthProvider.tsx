import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { useRouter, useSegments } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = "37bdcadd-4948-4dff-9c60-a3d119fa4ab5";
const TENANT_ID = "b3c5783b-8e0b-4639-85b6-e17c2dabed5b";
const AUTH_SCOPES = [
  "api://37bdcadd-4948-4dff-9c60-a3d119fa4ab5/user_impersonation",
];

type AuthContextType = {
  user: unknown | null;
  accessToken: string | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // oggeto di navigazione di expo per fare redirect
  const segments = useSegments(); // restituisce l array dei segmenti della route corrente

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

          // If needed, fetch the profile from Microsoft Graph and store it in state.
          // const profile = await fetch("https://graph.microsoft.com/v1.0/me", {
          //   headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
          // }).then((r) => r.json());
          // setUser(profile);
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
    () => ({ user, accessToken, isLoading, signIn, signOut }),
    [user, accessToken, isLoading],
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
