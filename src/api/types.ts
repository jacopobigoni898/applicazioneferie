// DTO restituito da /Auth/microsoft-login
export type RispostaAuth = {
  idUtente: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: string;
};
