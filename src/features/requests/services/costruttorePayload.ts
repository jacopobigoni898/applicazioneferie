// Funzione per la costruzione del DTO di aggiornamento permesso.
import { aStringaIsoLocale } from "./serializzazioneDate";
import {
  DtoAggiornamentoPermesso,
  InputAggiornamentoFerie,
} from "./tipiRichieste";

// Costruisce il DTO per aggiornare un permesso a partire da un InputAggiornamentoFerie
export const costruisciDtoAggiornamentoPermesso = (
  payload: InputAggiornamentoFerie,
  tipo?: string,
): DtoAggiornamentoPermesso => ({
  tipo: tipo || "permesso",
  dataInizio: aStringaIsoLocale(new Date(payload.DataInizio)),
  dataFine: aStringaIsoLocale(new Date(payload.DataFine)),
  statoApprovazione: payload.StatoApprovazione,
  idRichiesta: payload.IdRichiesta,
});
