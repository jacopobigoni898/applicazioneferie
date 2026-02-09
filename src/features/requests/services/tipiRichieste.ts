// Tipi, DTO e type guards condivisi per il servizio richieste.
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { RichiestaStraordinario } from "../../../domain/entities/RequestExtraordinary";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { RichiestaPermesso } from "../../../domain/entities/PermitsRequest";
import { RichiestaMalattia } from "../../../domain/entities/SickRequest";

// --- Endpoint del backend ---

export const ENDPOINT_RICHIESTE = "/requests";
export const ENDPOINT_AGGIUNGI_FERIE =
  "/RichiestaFerie/utente/addRichiestaFerie";
export const ENDPOINT_LISTA_FERIE = "/RichiestaFerie/utente/getAllAssenzeById";
export const ENDPOINT_ELIMINA_FERIE =
  "/RichiestaFerie/utente/deleteRichiestaFerie";
export const ENDPOINT_AGGIORNA_FERIE =
  "/RichiestaFerie/utente/updateRichiestaFerie";
export const ENDPOINT_AGGIUNGI_PERMESSI =
  "/RichiestaPermessi/utente/addRichiestaPermessi";
export const ENDPOINT_AGGIORNA_PERMESSI =
  "/RichiestaPermessi/utente/updateRichiestaPermessi";
export const ENDPOINT_ELIMINA_PERMESSI =
  "/RichiestaPermessi/utente/deleteRichiestaPermessi";

// --- Union dei payload gestiti ---

export type PayloadRichiesta =
  | RichiestaStraordinario
  | RichiestaFerie
  | RichiestaPermesso
  | RichiestaMalattia;

// --- Parametri e DTO ---

export type ParametriCostruzioneRichiesta = {
  tipoPrincipale: "assenza" | "straordinari";
  sottoTipo: string;
  dataInizio: Date;
  dataFine: Date;
  idUtente: number;
  stato?: StatoRichiesta;
};

export type RisultatoPostDTO = {
  Esito: string;
  CreatedCount: number;
  SkippedDates: string[];
  Motivazione?: string | null;
};

export type RisultatoDeleteDTO = {
  Esito: string;
  Motivazione?: string | null;
};

export type InputAggiornamentoFerie = {
  IdRichiesta: number;
  DataInizio: string;
  DataFine: string;
  StatoApprovazione: string;
};

export type DtoBase = {
  id_richiesta: number;
  id_utente: number;
  data_inizio: string;
  data_fine: string;
  stato_approvazione: StatoRichiesta;
};

export type DtoRichiesta =
  | (DtoBase & { tipo_permesso?: string })
  | (DtoBase & { certificato_medico?: string });

export type DtoAggiuntaFerie = {
  DataInizio: string;
  DataFine: string;
  StatoApprovazione: string;
};

export type DtoAggiuntaPermesso = {
  tipoPermesso: string;
  dataInizio: string;
  dataFine: string;
};

export type DtoAggiornamentoPermesso = {
  tipo: string;
  dataInizio: string;
  dataFine: string;
  statoApprovazione: string;
  idRichiesta: number;
};

// --- Type guards ---

export const eRichiestaPermesso = (
  payload: PayloadRichiesta,
): payload is RichiestaPermesso =>
  (payload as RichiestaPermesso).tipo_permesso !== undefined;

export const eRichiestaMalattia = (
  payload: PayloadRichiesta,
): payload is RichiestaMalattia =>
  (payload as RichiestaMalattia).certificato_medico !== undefined;

// --- Helper per determinare la categoria di richiesta ---

export type CategoriaRichiesta = "ferie" | "permesso" | "sconosciuto";

export const determinaCategoriaRichiesta = (
  tipo?: string,
): CategoriaRichiesta => {
  //console.log(tipo);
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
