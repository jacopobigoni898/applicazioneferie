// Servizio centralizzato per costruire e inviare le richieste al backend.
// Gestisce la normalizzazione dei campi e la serializzazione delle date.
import { http } from "../../../api/httpClient";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { TipoRichiesta } from "../../../domain/entities/TypeRequest";
import { RichiestaStraordinario } from "../../../domain/entities/RequestExtraordinary";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { RichiestaPermesso } from "../../../domain/entities/PermitsRequest";
import { RichiestaMalattia } from "../../../domain/entities/SickRequest";
import { mappaRispostaFerie } from "../mappers/holidayMapper";

// Endpoint del backend
const ENDPOINT_RICHIESTE = "/requests";
const ENDPOINT_AGGIUNGI_FERIE = "/RichiestaFerie/utente/addRichiestaFerie";
const ENDPOINT_LISTA_FERIE = "/RichiestaFerie/utente/getAllAssenzeById";
const ENDPOINT_ELIMINA_FERIE = "/RichiestaFerie/utente/deleteRichiestaFerie";
const ENDPOINT_AGGIORNA_FERIE = "/RichiestaFerie/utente/updateRichiestaFerie";
const ENDPOINT_AGGIUNGI_PERMESSI =
  "/RichiestaPermessi/utente/addRichiestaPermessi";
const ENDPOINT_AGGIORNA_PERMESSI =
  "/RichiestaPermessi/utente/updateRichiestaPermessi";
const ENDPOINT_ELIMINA_PERMESSI =
  "/RichiestaPermessi/utente/deleteRichiestaPermessi";

// Union dei payload gestiti
export type PayloadRichiesta =
  | RichiestaStraordinario
  | RichiestaFerie
  | RichiestaPermesso
  | RichiestaMalattia;

// Parametri per costruire un payload
export type ParametriCostruzioneRichiesta = {
  tipoPrincipale: "assenza" | "straordinari";
  sottoTipo: string;
  dataInizio: Date;
  dataFine: Date;
  idUtente: number;
  stato?: StatoRichiesta;
};

// DTO risultato delle operazioni POST
export type RisultatoPostDTO = {
  Esito: string;
  CreatedCount: number;
  SkippedDates: string[];
  Motivazione?: string | null;
};

// DTO risultato delle operazioni DELETE
export type RisultatoDeleteDTO = {
  Esito: string;
  Motivazione?: string | null;
};

// Payload per aggiornare una richiesta esistente
export type InputAggiornamentoFerie = {
  IdRichiesta: number;
  DataInizio: string;
  DataFine: string;
  StatoApprovazione: string;
};

// DTO base per la serializzazione
type DtoBase = {
  id_richiesta: number;
  id_utente: number;
  data_inizio: string;
  data_fine: string;
  stato_approvazione: StatoRichiesta;
};

type DtoRichiesta =
  | (DtoBase & { tipo_permesso?: string })
  | (DtoBase & { certificato_medico?: string });

// DTO per aggiungere ferie (campi PascalCase richiesti dal backend)
type DtoAggiuntaFerie = {
  DataInizio: string;
  DataFine: string;
  StatoApprovazione: string;
};

type DtoAggiuntaPermesso = {
  tipoPermesso: string;
  dataInizio: string;
  dataFine: string;
};

type DtoAggiornamentoPermesso = {
  tipo: string;
  dataInizio: string;
  dataFine: string;
  statoApprovazione: string;
  idRichiesta: number;
};

// --- Helper di serializzazione ---

// Formatta un numero con zero iniziale a due cifre
const formattaDueCifre = (n: number) => String(n).padStart(2, "0");

// Converte usando componenti UTC. Output: yyyy-MM-ddTHH:mm:ss senza Z
const aStringaIsoLocale = (data: Date) => {
  const a = data.getUTCFullYear();
  const m = formattaDueCifre(data.getUTCMonth() + 1);
  const g = formattaDueCifre(data.getUTCDate());
  const o = formattaDueCifre(data.getUTCHours());
  const min = formattaDueCifre(data.getUTCMinutes());
  const s = formattaDueCifre(data.getUTCSeconds());
  return `${a}-${m}-${g}T${o}:${min}:${s}`;
};

// Versione con spazio per backend che usa DateTime.Parse
const aStringaDataOraConSpazio = (data: Date) => {
  return aStringaIsoLocale(data).replace("T", " ");
};

// --- Type guards ---

const eRichiestaPermesso = (
  payload: PayloadRichiesta,
): payload is RichiestaPermesso =>
  (payload as RichiestaPermesso).tipo_permesso !== undefined;

const eRichiestaMalattia = (
  payload: PayloadRichiesta,
): payload is RichiestaMalattia =>
  (payload as RichiestaMalattia).certificato_medico !== undefined;

// --- Helper per determinare il tipo di richiesta da stringa ---

type CategoriaRichiesta = "ferie" | "permesso" | "sconosciuto";

const determinaCategoriaRichiesta = (tipo?: string): CategoriaRichiesta => {
  const tipoMinuscolo = (tipo || "").toLowerCase();
  if (tipoMinuscolo.includes("ferie") || tipoMinuscolo === "") return "ferie";
  if (
    tipoMinuscolo.includes("permess") ||
    tipoMinuscolo.includes("visita") ||
    tipoMinuscolo.includes("l104") ||
    tipoMinuscolo.includes("genitoriale") ||
    tipoMinuscolo.includes("matrimoniale") ||
    tipoMinuscolo.includes("studio")
  )
    return "permesso";
  return "sconosciuto";
};

// --- Costruzione payload ---

const costruisciDtoAggiornamentoPermesso = (
  payload: InputAggiornamentoFerie,
  tipo?: string,
): DtoAggiornamentoPermesso => ({
  tipo: tipo || "permesso",
  dataInizio: payload.DataInizio,
  dataFine: payload.DataFine,
  statoApprovazione: payload.StatoApprovazione,
  idRichiesta: payload.IdRichiesta,
});

export const costruisciPayloadRichiesta = ({
  tipoPrincipale,
  sottoTipo,
  dataInizio,
  dataFine,
  idUtente,
  stato = StatoRichiesta.IN_ATTESA,
}: ParametriCostruzioneRichiesta): PayloadRichiesta => {
  if (tipoPrincipale === "straordinari") {
    const richiesta: RichiestaStraordinario = {
      id_richiesta: 0,
      id_utente: idUtente,
      data_inizio: dataInizio,
      data_fine: dataFine,
      stato_approvazione: stato,
    };
    return richiesta;
  }

  const tipoMinuscolo = sottoTipo.toLowerCase();

  if (tipoMinuscolo.includes(TipoRichiesta.FERIE)) {
    const richiesta: RichiestaFerie = {
      id_richiesta: 0,
      id_utente: idUtente,
      data_inizio: dataInizio,
      data_fine: dataFine,
      stato_approvazione: stato,
    };
    return richiesta;
  }

  if (tipoMinuscolo.includes(TipoRichiesta.MALATTIA)) {
    const richiesta: RichiestaMalattia = {
      id_richiesta: 0,
      id_utente: idUtente,
      data_inizio: dataInizio,
      data_fine: dataFine,
      stato_approvazione: stato,
      certificato_medico: "",
    };
    return richiesta;
  }

  const richiesta: RichiestaPermesso = {
    id_richiesta: 0,
    id_utente: idUtente,
    tipo_permesso: sottoTipo,
    data_inizio: dataInizio,
    data_fine: dataFine,
    stato_approvazione: stato,
  };
  return richiesta;
};

const mappaPayloadADto = (payload: PayloadRichiesta): DtoRichiesta => {
  const base: DtoBase = {
    id_richiesta: payload.id_richiesta,
    id_utente: payload.id_utente,
    data_inizio: aStringaIsoLocale(payload.data_inizio),
    data_fine: aStringaIsoLocale(payload.data_fine),
    stato_approvazione: payload.stato_approvazione,
  };

  if (eRichiestaPermesso(payload)) {
    return { ...base, tipo_permesso: payload.tipo_permesso };
  }
  if (eRichiestaMalattia(payload)) {
    return { ...base, certificato_medico: String(payload.certificato_medico) };
  }
  return base;
};

// --- Funzioni API ---

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
  const formatoAnnoMeseGiorno = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

  const filtro =
    filtroData && filtroData.trim() !== ""
      ? filtroData
      : formatoAnnoMeseGiorno(oggi);
  const query = `?data=${encodeURIComponent(filtro)}`;
  const { data } = await http.get<any[]>(`${ENDPOINT_LISTA_FERIE}${query}`);
  return (data || []).map(mappaRispostaFerie);
};

// Elimina una richiesta permessi per ID
const eliminaPermessiPerId = async (id: number): Promise<RisultatoDeleteDTO> => {
  const { data } = await http.delete<any>(
    `${ENDPOINT_ELIMINA_PERMESSI}?id=${id}`,
  );
  return {
    Esito: String(data?.esito ?? ""),
    Motivazione: data?.motivazione ?? null,
  };
};

// Elimina una richiesta per ID, instradando per tipo (ferie vs permessi)
export const eliminaFeriePerId = async (
  id: number,
  tipo?: string,
): Promise<RisultatoDeleteDTO> => {
  const categoria = determinaCategoriaRichiesta(tipo);

  if (categoria === "ferie") {
    const { data } = await http.delete<any>(
      `${ENDPOINT_ELIMINA_FERIE}?id=${id}`,
    );
    return {
      Esito: String(data?.esito ?? ""),
      Motivazione: data?.motivazione ?? null,
    };
  }

  if (categoria === "permesso") {
    return eliminaPermessiPerId(id);
  }

  throw new Error(
    `Delete non implementata per il tipo '${tipo || "sconosciuto"}'`,
  );
};

// Aggiorna una richiesta ferie esistente
export const aggiornaFerie = async (payload: InputAggiornamentoFerie) => {
  const { data } = await http.put(ENDPOINT_AGGIORNA_FERIE, payload);
  return data;
};

// Aggiorna una richiesta permessi esistente
export const aggiornaPermessi = async (payload: DtoAggiornamentoPermesso) => {
  const { data } = await http.put(ENDPOINT_AGGIORNA_PERMESSI, payload);
  return data;
};

// Aggiorna una richiesta instradando per tipo (ferie vs permessi)
export const aggiornaRichiesta = async (
  payload: InputAggiornamentoFerie,
  tipo?: string,
) => {
  const categoria = determinaCategoriaRichiesta(tipo);

  if (categoria === "ferie") return aggiornaFerie(payload);

  if (categoria === "permesso") {
    const dtoPermesso = costruisciDtoAggiornamentoPermesso(payload, tipo);
    return aggiornaPermessi(dtoPermesso);
  }

  throw new Error(
    `Update non implementata per il tipo '${tipo || "sconosciuto"}'`,
  );
};

// Aggiunge una richiesta permessi
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
