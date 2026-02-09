// Ruoli dell'utente nell'applicazione
export enum RuoloUtente {
  ADMIN = "ADMIN",
  UTENTE = "USER",
}

// Entità Utente
export interface Utente {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: RuoloUtente;
}

// Mantenuto per compatibilità
export type User = Utente;
