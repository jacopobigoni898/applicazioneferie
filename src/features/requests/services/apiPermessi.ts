// Servizio API per le operazioni di delete/update sui permessi.
import { http } from "../../../api/httpClient";
import {
  DtoAggiornamentoPermesso,
  RisultatoDeleteDTO,
  ENDPOINT_AGGIORNA_PERMESSI,
  ENDPOINT_ELIMINA_PERMESSI,
} from "./tipiRichieste";

// Elimina una richiesta permessi per ID
export const eliminaPermessiPerId = async (
  id: number,
): Promise<RisultatoDeleteDTO> => {
  const { data } = await http.delete<any>(
    `${ENDPOINT_ELIMINA_PERMESSI}?id=${id}`,
  );
  return {
    Esito: String(data?.esito ?? ""),
    Motivazione: data?.motivazione ?? null,
  };
};

// Aggiorna una richiesta permessi esistente
export const aggiornaPermessi = async (payload: DtoAggiornamentoPermesso) => {
  const { data } = await http.put(ENDPOINT_AGGIORNA_PERMESSI, payload);
  return data;
};
