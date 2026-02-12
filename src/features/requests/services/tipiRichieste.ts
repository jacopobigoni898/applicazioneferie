// Tipi, DTO e costanti condivisi per il servizio richieste.

// --- Endpoint unificati del backend ---

export const ENDPOINT_TUTTE_RICHIESTE =
  "/Richieste/utente/getAllRichiesteById";
export const ENDPOINT_AGGIUNGI_RICHIESTA =
  "/Richieste/utente/addRichiesta";
export const ENDPOINT_AGGIORNA_RICHIESTA =
  "/Richieste/utente/updateRichiesta";
export const ENDPOINT_ELIMINA_RICHIESTA =
  "/Richieste/utente/deleteRichiesta";
export const ENDPOINT_TUTTI_TIPO_RICHIESTA =
  "/TipoRichiesta/getAllTipoRichiesta";

// --- Modello TipoRichiesta dal backend ---

export interface TipoRichiestaDTO {
  idTipoRichiesta: number;
  tipoRichiesta: string;
  richiedeDocumenti: boolean;
  richiedeCodice: boolean;
}

// --- Payload per la creazione di una nuova richiesta ---

export type AddRichiestaPayload = {
  dataInizio: string;
  dataFine: string;
  idTipoRichiesta: number;
  nota: string;
};

// --- DTO per le risposte ---

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

// --- DTO per l'aggiornamento di una richiesta ---

export type InputAggiornamentoRichiesta = {
  IdRichiesta: number;
  DataInizio: string;
  DataFine: string;
  StatoApprovazione: string;
};
