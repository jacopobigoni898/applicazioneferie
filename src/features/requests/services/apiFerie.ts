// Servizio API per le operazioni CRUD sulle ferie.
import { http } from "../../../api/httpClient";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { mappaRispostaFerie } from "../mappers/holidayMapper";
import {
  aStringaDataOraConSpazio,
  formatoAnnoMeseGiorno,
} from "./serializzazioneDate";
import {
  DtoAggiuntaFerie,
  RisultatoPostDTO,
  RisultatoDeleteDTO,
  InputAggiornamentoFerie,
  ENDPOINT_AGGIUNGI_FERIE,
  ENDPOINT_LISTA_FERIE,
  ENDPOINT_ELIMINA_FERIE,
  ENDPOINT_AGGIORNA_FERIE,
} from "./tipiRichieste";

// Invia una richiesta ferie usando l'utente dedotto dal token
export const inviaFerieConToken = async (
  dataInizio: Date,
  dataFine: Date,
): Promise<RisultatoPostDTO> => {
  const dto: DtoAggiuntaFerie = {
    DataInizio: aStringaDataOraConSpazio(dataInizio),
    DataFine: aStringaDataOraConSpazio(dataFine),
    StatoApprovazione: StatoRichiesta.IN_ATTESA,
  };

  const { data } = await http.post<any>(ENDPOINT_AGGIUNGI_FERIE, dto);
  return {
    Esito: String(data?.esito ?? ""),
    CreatedCount: Number(data?.createdCount ?? 0),
    SkippedDates: Array.isArray(data?.skippedDates) ? data.skippedDates : [],
    Motivazione: data?.motivazione ?? null,
  };
};

// Recupera tutte le assenze dell'utente dal backend
export const recuperaFerieConToken = async (
  filtroData?: string,
): Promise<RichiestaFerie[]> => {
  const oggi = new Date();
  const filtro =
    filtroData && filtroData.trim() !== ""
      ? filtroData
      : formatoAnnoMeseGiorno(oggi);
  const query = `?data=${encodeURIComponent(filtro)}`;
  const { data } = await http.get<any[]>(`${ENDPOINT_LISTA_FERIE}${query}`);
  return (data || []).map(mappaRispostaFerie);
};

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
