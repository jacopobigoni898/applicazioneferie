// Barrel file: re-export da tutti i moduli del servizio richieste.
// I consumatori possono continuare a importare da qui senza cambiare nulla.

// Tipi, DTO, type guards e costanti condivise
export {
  type PayloadRichiesta,
  type ParametriCostruzioneRichiesta,
  type RisultatoPostDTO,
  type RisultatoDeleteDTO,
  type InputAggiornamentoFerie,
  type DtoBase,
  type DtoRichiesta,
  type DtoAggiuntaFerie,
  type DtoAggiuntaPermesso,
  type DtoAggiornamentoPermesso,
  type CategoriaRichiesta,
  eRichiestaPermesso,
  eRichiestaMalattia,
  determinaCategoriaRichiesta,
} from "./tipiRichieste";

// Helper di serializzazione date
export {
  formattaDueCifre,
  aStringaIsoLocale,
  aStringaDataOraConSpazio,
  formatoAnnoMeseGiorno,
} from "./serializzazioneDate";

// Costruzione payload e conversione a DTO
export {
  costruisciDtoAggiornamentoPermesso,
  costruisciPayloadRichiesta,
  mappaPayloadADto,
} from "./costruttorePayload";

// API Ferie
export {
  inviaFerieConToken,
  recuperaFerieConToken,
  eliminaFeriePerIdDiretto,
  aggiornaFerie,
} from "./apiFerie";

// API Permessi
export {
  inviaRichiesta,
  eliminaPermessiPerId,
  aggiornaPermessi,
  aggiungiRichiestaPermessi,
} from "./apiPermessi";

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
    console.log(dtoPermesso);
    return aggiornaPermessi(dtoPermesso);
  }

  throw new Error(
    `Update non implementata per il tipo '${tipo || "sconosciuto"}'`,
  );
};
