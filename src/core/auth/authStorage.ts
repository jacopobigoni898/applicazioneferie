import * as SecureStore from "expo-secure-store";

export type AuthSessionData = {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: number; // epoch ms
};

const ACCESS_TOKEN_KEY = "msal_access_token_v2";

const safeParse = (raw: string | null): AuthSessionData | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSessionData;
  } catch (error) {
    console.warn("Impossibile parsare il token da SecureStore", error);
    return null;
  }
};

export const authStorage = {
  getSession: async (): Promise<AuthSessionData | null> => {
    try {
      const raw = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      return safeParse(raw);
    } catch (error) {
      console.warn("Impossibile leggere il token da SecureStore", error);
      return null;
    }
  },

  setSession: async (session: AuthSessionData): Promise<void> => {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, JSON.stringify(session));
    } catch (error) {
      console.warn("Impossibile salvare il token su SecureStore", error);
    }
  },

  deleteSession: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.warn("Impossibile cancellare il token da SecureStore", error);
    }
  },

  // helper per l'interceptor
  getAccessToken: async (): Promise<string | null> => {
    const session = await authStorage.getSession();
    return session?.accessToken ?? null;
  },
};
