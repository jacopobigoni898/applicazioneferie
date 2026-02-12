// Barrel file: re-export da tutti i moduli del servizio richieste.
// I consumatori possono continuare a importare da qui senza cambiare nulla.

// Tipi, DTO e costanti condivise
export {
  type TipoRichiestaDTO,
  type AddRichiestaPayload,
  type RisultatoPostDTO,
  type RisultatoDeleteDTO,
  type InputAggiornamentoFerie,
  type DtoAggiornamentoPermesso,
  type CategoriaRichiesta,
  determinaCategoriaRichiesta,
} from "./tipiRichieste";

// Helper di serializzazione date
export {
  aStringaIsoLocale,
  formatoAnnoMeseGiorno,
} from "./serializzazioneDate";

// Costruzione DTO per aggiornamento
export { costruisciDtoAggiornamentoPermesso } from "./costruttorePayload";

// API Ferie (delete/update)
export { eliminaFeriePerIdDiretto, aggiornaFerie } from "./apiFerie";

// API Permessi (delete/update)
export { eliminaPermessiPerId, aggiornaPermessi } from "./apiPermessi";

// API Richieste (nuovi endpoint unificati)
export {
  recuperaTipiRichiesta,
  recuperaTutteRichieste,
  aggiungiRichiesta,
} from "./apiRichieste";

// --- Funzioni di orchestrazione (dipendono da più moduli) ---

import {
  determinaCategoriaRichiesta,
  InputAggiornamentoFerie,
} from "./tipiRichieste";
import { eliminaFeriePerIdDiretto, aggiornaFerie } from "./apiFerie";
import { eliminaPermessiPerId, aggiornaPermessi } from "./apiPermessi";
import { costruisciDtoAggiornamentoPermesso } from "./costruttorePayload";
import type { RisultatoDeleteDTO } from "./tipiRichieste";

// Elimina una richiesta per ID, instradando per tipo (ferie vs permessi)
export const eliminaFeriePerId = async (
  id: number,
  tipo?: string,
): Promise<RisultatoDeleteDTO> => {
  const categoria = determinaCategoriaRichiesta(tipo);
  if (categoria === "ferie") {
    return eliminaFeriePerIdDiretto(id);
  }

  if (categoria === "permesso") {
    return eliminaPermessiPerId(id);
  }

  throw new Error(
    `Delete non implementata per il tipo '${tipo || "sconosciuto"}'`,
  );
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
