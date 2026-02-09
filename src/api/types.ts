// DTO restituito da /Auth/microsoft-login (segnaposto)
export type RispostaAutenticazione = {
  idUtente: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: string;
};
