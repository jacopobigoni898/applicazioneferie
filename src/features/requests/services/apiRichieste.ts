// Servizio API per i nuovi endpoint unificati delle richieste.
import { http } from "../../../api/httpClient";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { mappaRispostaFerie } from "../mappers/holidayMapper";
import { formatoAnnoMeseGiorno } from "./serializzazioneDate";
import {
  TipoRichiestaDTO,
  AddRichiestaPayload,
  RisultatoPostDTO,
  ENDPOINT_TUTTE_RICHIESTE,
  ENDPOINT_AGGIUNGI_RICHIESTA,
  ENDPOINT_TUTTI_TIPO_RICHIESTA,
} from "./tipiRichieste";

// Recupera tutte le tipologie di richiesta dal backend
export const recuperaTipiRichiesta = async (): Promise<TipoRichiestaDTO[]> => {
  const { data } = await http.get<TipoRichiestaDTO[]>(
    ENDPOINT_TUTTI_TIPO_RICHIESTA,
  );
  return data || [];
};

// Recupera tutte le richieste dell'utente, passando la data odierna come parametro
export const recuperaTutteRichieste = async (
  filtroData?: string,
): Promise<RichiestaFerie[]> => {
  const oggi = new Date();
  const filtro =
    filtroData && filtroData.trim() !== ""
      ? filtroData
      : formatoAnnoMeseGiorno(oggi);
  const query = `?data=${encodeURIComponent(filtro)}`;
  const { data } = await http.get<any[]>(
    `${ENDPOINT_TUTTE_RICHIESTE}${query}`,
  );
  return (data || []).map(mappaRispostaFerie);
};

// Invia una nuova richiesta con il payload unificato
export const aggiungiRichiesta = async (
  payload: AddRichiestaPayload,
): Promise<RisultatoPostDTO> => {
  const { data } = await http.post<any>(ENDPOINT_AGGIUNGI_RICHIESTA, payload);
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
