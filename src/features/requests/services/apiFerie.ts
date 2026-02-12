// Servizio API per le operazioni di delete/update sulle ferie.
import { http } from "../../../api/httpClient";
import {
  RisultatoDeleteDTO,
  InputAggiornamentoFerie,
  ENDPOINT_ELIMINA_FERIE,
  ENDPOINT_AGGIORNA_FERIE,
} from "./tipiRichieste";

// Elimina una richiesta ferie per ID
export const eliminaFeriePerIdDiretto = async (
  id: number,
): Promise<RisultatoDeleteDTO> => {
  const { data } = await http.delete<any>(
    `${ENDPOINT_ELIMINA_FERIE}?id=${id}`,
  );
  return {
    Esito: String(data?.esito ?? ""),
    Motivazione: data?.motivazione ?? null,
  };
};

// Aggiorna una richiesta ferie esistente
export const aggiornaFerie = async (payload: InputAggiornamentoFerie) => {
  const { data } = await http.put(ENDPOINT_AGGIORNA_FERIE, payload);
  return data;
};
