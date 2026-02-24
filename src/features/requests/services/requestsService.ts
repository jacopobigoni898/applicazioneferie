// Barrel file: re-export da tutti i moduli del servizio richieste.
// I consumatori possono continuare a importare da qui senza cambiare nulla.

// Tipi, DTO e costanti condivise
export {
  type TipoRichiestaDTO,
  type AddRichiestaPayload,
  type RisultatoPostDTO,
  type RisultatoDeleteDTO,
  type InputAggiornamentoRichiesta,
} from "./tipiRichieste";

// Helper di serializzazione date
export {
  aStringaIsoLocale,
  formatoAnnoMeseGiorno,
} from "./serializzazioneDate";

// API Richieste (endpoint unificati)
export {
  recuperaTipiRichiesta,
  recuperaTutteRichieste,
  recuperaTutteRichiesteAdmin,
  aggiungiRichiesta,
  eliminaRichiesta,
  aggiornaRichiesta,
  recuperaDocumento,
} from "./apiRichieste";
