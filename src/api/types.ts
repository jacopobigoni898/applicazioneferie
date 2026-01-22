// DTO restituito da /Auth/microsoft-login
export type AuthResponse = {
  idUtente: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: string;
};
