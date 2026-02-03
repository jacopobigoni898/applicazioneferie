import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "msal_access_token";

export const authStorage = {
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.warn("Impossibile leggere il token da SecureStore", error);
      return null;
    }
  },
  setToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.warn("Impossibile salvare il token su SecureStore", error);
    }
  },
  deleteToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.warn("Impossibile cancellare il token da SecureStore", error);
    }
  },
};
