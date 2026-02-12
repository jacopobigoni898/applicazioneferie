// Tipi, DTO e costanti condivisi per il servizio richieste.

// --- Endpoint del backend (legacy, per delete/update) ---

export const ENDPOINT_ELIMINA_FERIE =
  "/RichiestaFerie/utente/deleteRichiestaFerie";
export const ENDPOINT_AGGIORNA_FERIE =
  "/RichiestaFerie/utente/updateRichiestaFerie";
export const ENDPOINT_AGGIORNA_PERMESSI =
  "/RichiestaPermessi/utente/updateRichiestaPermessi";
export const ENDPOINT_ELIMINA_PERMESSI =
  "/RichiestaPermessi/utente/deleteRichiestaPermessi";

// Nuovi endpoint unificati
export const ENDPOINT_TUTTE_RICHIESTE =
  "/Richieste/utente/getAllRichiesteById";
export const ENDPOINT_AGGIUNGI_RICHIESTA =
  "/Richieste/utente/addRichiesta";
export const ENDPOINT_TUTTI_TIPO_RICHIESTA =
  "/TipoRichiesta/getAllTipoRichiesta";

// --- Modello TipoRichiesta dal backend ---

export interface TipoRichiestaDTO {
  idTipoRichiesta: number;
  tipoRichiesta: string;
  richiedeDocumenti: boolean;
  richiedeCodice: boolean;
}

// --- Payload per la creazione di una nuova richiesta (nuovo endpoint) ---

export type AddRichiestaPayload = {
  dataInizio: string;
  dataFine: string;
  idTipoRichiesta: number;
  nota: string;
};

// --- DTO e tipi ancora in uso per delete/update ---

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

export type DtoAggiornamentoPermesso = {
  tipo: string;
  dataInizio: string;
  dataFine: string;
  statoApprovazione: string;
  idRichiesta: number;
};

// --- Helper per determinare la categoria di richiesta (per delete/update routing) ---

export type CategoriaRichiesta = "ferie" | "permesso" | "sconosciuto";

export const determinaCategoriaRichiesta = (
  tipo?: string,
): CategoriaRichiesta => {
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
