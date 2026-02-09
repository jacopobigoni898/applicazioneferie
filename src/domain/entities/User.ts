// Ruoli dell'utente nell'applicazione
export enum RuoloUtente {
  ADMIN = "Admin",
  UTENTE = "Utente",
}

// Entità Utente
export interface Utente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  ruolo: RuoloUtente;
}
