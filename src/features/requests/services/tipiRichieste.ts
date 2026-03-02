// Tipi, DTO e costanti condivisi per il servizio richieste.

// --- Endpoint unificati del backend ---

export const ENDPOINT_TUTTE_RICHIESTE = "/Richieste/utente/getAllRichiesteById";
export const ENDPOINT_AGGIUNGI_RICHIESTA = "/Richieste/utente/addRichiesta";
export const ENDPOINT_AGGIORNA_RICHIESTA = "/Richieste/utente/updateRichiesta";
export const ENDPOINT_ELIMINA_RICHIESTA = "/Richieste/utente/deleteRichiesta";
export const ENDPOINT_TUTTI_TIPO_RICHIESTA =
  "/TipoRichiesta/getAllTipoRichiesta";

export const ENDPOINT_GETDOCUMENTI = "/Richieste/utente/getDocumenti";
export const ENDPOINT_ADMIN_TUTTE_RICHIESTE =
  "/Richieste/admin/getAllRichieste";
// --- Modello TipoRichiesta dal backend ---

export const ENDPOINT_ADMIN_AUTORIZZA_RICHIESTA =
  "/Richieste/admin/AutorizzaRichiesta";
export const ENDPOINT_ADMIN_RIFIUTA_RICHIESTA =
  "/Richieste/admin/RifiutaRichiesta";
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
  codiceRichiesta?: string;
  documento?: {
    uri: string;
    name: string;
    type: string;
  };
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
  Documento?: {
    uri: string;
    name: string;
    type: string;
  };
};
