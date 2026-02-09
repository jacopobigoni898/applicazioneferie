// Ruoli dell'utente nell'applicazione
export enum RuoloUtente {
  ADMIN = "ADMIN",
  UTENTE = "UTENTE",
}

// Entità Utente
export interface Utente {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: RuoloUtente;
}
