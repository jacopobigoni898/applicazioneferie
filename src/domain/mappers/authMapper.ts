import { Utente, RuoloUtente } from "../entities/User";
import type { RispostaAuth } from "../../api/types";

// Mappa il DTO di login nell'entità di dominio Utente
export const mappaRispostaAuthAUtente = (dto: RispostaAuth): Utente => {
  const ruoloNormalizzato = dto.ruolo?.toLowerCase() ?? "";
  const ruolo: RuoloUtente =
    ruoloNormalizzato === "admin" ? RuoloUtente.ADMIN : RuoloUtente.UTENTE;

  return {
    id: String(dto.idUtente),
    nome: dto.nome,
    cognome: dto.cognome,
    email: dto.email,
    ruolo,
  };
};
