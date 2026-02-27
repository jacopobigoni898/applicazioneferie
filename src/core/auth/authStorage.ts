import * as SecureStore from "expo-secure-store";

// Modello della sessione MSAL persistita su SecureStore
export type DatiSessioneAuth = {
  tokenAccesso: string;
  tokenAggiornamento?: string | null;
  scadenzaA?: number; // epoch ms
};

// Chiave isolata per evitare collisioni con versioni precedenti
const CHIAVE_TOKEN_ACCESSO = "msal_access_token_v2";

// Parsing difensivo per gestire record corrotti in SecureStore
const parseSicuro = (grezzo: string | null): DatiSessioneAuth | null => {
  if (!grezzo) return null;
  try {
    return JSON.parse(grezzo) as DatiSessioneAuth;
  } catch (errore) {
    console.warn("Impossibile parsare il token da SecureStore", errore);
    return null;
  }
};

export const storageAuth = {
  recuperaSessione: async (): Promise<DatiSessioneAuth | null> => {
    try {
      const grezzo = await SecureStore.getItemAsync(CHIAVE_TOKEN_ACCESSO);
      return parseSicuro(grezzo);
      console.log(grezzo);
    } catch (errore) {
      console.warn("Impossibile leggere il token da SecureStore", errore);
      return null;
    }
  },

  salvaSessione: async (sessione: DatiSessioneAuth): Promise<void> => {
    try {
      await SecureStore.setItemAsync(
        CHIAVE_TOKEN_ACCESSO,
        JSON.stringify(sessione),
      );
    } catch (errore) {
      console.warn("Impossibile salvare il token su SecureStore", errore);
    }
  },

  cancellaSessione: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(CHIAVE_TOKEN_ACCESSO);
    } catch (errore) {
      console.warn("Impossibile cancellare il token da SecureStore", errore);
    }
  },

  // Helper per l'interceptor
  recuperaTokenAccesso: async (): Promise<string | null> => {
    const sessione = await storageAuth.recuperaSessione();
    return sessione?.tokenAccesso ?? null;
  },
};
