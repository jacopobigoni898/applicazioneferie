// Gestione dello storage della sessione di autenticazione (segnaposto)
// Qui andrà la logica per salvare/recuperare i token da SecureStore

// Modello della sessione di autenticazione
export type DatiSessioneAuth = {
  tokenAccesso: string;
  tokenAggiornamento?: string | null;
  scadenzaIn?: number; // epoch ms
};

// Segnaposto: operazioni sullo storage della sessione
export const storageAuth = {
  recuperaSessione: async (): Promise<DatiSessioneAuth | null> => null,
  salvaSessione: async (_sessione: DatiSessioneAuth): Promise<void> => {},
  cancellaSessione: async (): Promise<void> => {},
  recuperaTokenAccesso: async (): Promise<string | null> => null,
};
