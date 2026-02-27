import { http } from "./httpClient";
import { RispostaAuth } from "./types";
import { mappaRispostaAuthAUtente } from "../domain/mappers/authMapper";
import type { Utente } from "../domain/entities/User";

// Chiamata di login Microsoft: ritorna l'entità Utente mappata dal DTO API
export const recuperaLoginMicrosoft = async (): Promise<Utente> => {
  const { data } = await http.get<RispostaAuth>("/Auth/microsoft-login");
  return mappaRispostaAuthAUtente(data);
};
