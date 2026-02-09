// Servizio API per le operazioni CRUD sui permessi.
import { http } from "../../../api/httpClient";
import { aStringaIsoLocale, aStringaDataOraConSpazio } from "./serializzazioneDate";
import {
  PayloadRichiesta,
  DtoRichiesta,
  DtoAggiuntaPermesso,
  DtoAggiornamentoPermesso,
  RisultatoPostDTO,
  RisultatoDeleteDTO,
  eRichiestaPermesso,
  ENDPOINT_RICHIESTE,
  ENDPOINT_AGGIUNGI_PERMESSI,
  ENDPOINT_AGGIORNA_PERMESSI,
  ENDPOINT_ELIMINA_PERMESSI,
} from "./tipiRichieste";
import { mappaPayloadADto } from "./costruttorePayload";

// Invia una richiesta (permessi, malattia, o generico)
export const inviaRichiesta = async (payload: PayloadRichiesta) => {
  if (eRichiestaPermesso(payload)) {
    const dto = {
      tipoPermesso: payload.tipo_permesso,
      dataInizio: aStringaIsoLocale(payload.data_inizio).slice(0, 10),
      dataFine: aStringaIsoLocale(payload.data_fine).slice(0, 10),
    };
    const { data } = await http.post<any>(ENDPOINT_AGGIUNGI_PERMESSI, dto);
    return data;
  }

  const dto = mappaPayloadADto(payload);
  const { data } = await http.post<DtoRichiesta>(ENDPOINT_RICHIESTE, dto);
  return data;
};

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

// Aggiunge una richiesta permessi con date e tipo
export const aggiungiRichiestaPermessi = async (
  dataInizio: Date,
  dataFine: Date,
  tipoPermesso: string,
): Promise<RisultatoPostDTO> => {
  const dto: DtoAggiuntaPermesso = {
    tipoPermesso,
    dataInizio: aStringaDataOraConSpazio(dataInizio).slice(0, 10),
    dataFine: aStringaDataOraConSpazio(dataFine).slice(0, 10),
  };

  const { data } = await http.post<any>(ENDPOINT_AGGIUNGI_PERMESSI, dto);

  return {
    Esito: String(data?.esito ?? data?.Esito ?? ""),
    CreatedCount: Number(data?.createdCount ?? data?.CreatedCount ?? 0),
    SkippedDates: Array.isArray(data?.skippedDates)
      ? data.skippedDates
      : Array.isArray(data?.SkippedDates)
        ? data.SkippedDates
        : [],
    Motivazione: data?.motivazione ?? data?.Motivazione ?? null,
  };
};
