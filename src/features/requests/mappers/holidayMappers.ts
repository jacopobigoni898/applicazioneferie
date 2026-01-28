import { HolidayListDto } from "../services/requestsService";
import { RequestStatus } from "../../../domain/entities/RequestStatus";

/**
 * Normalizza le chiavi (snake_case/PascalCase) dal backend in camel snake coerente col resto
 * @param raw Oggetto grezzo dal backend
 * @returns HolidayListDto normalizzato
 */
export const mapHolidayItem = (raw: any): HolidayListDto => {
  // DEBUG: logga l'oggetto raw e l'id risolto
  const resolvedId = raw.idRichiesta;
  const idNum = Number(resolvedId);
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[mapHolidayItem] raw:", raw, "| id_richiesta risolto:", idNum);
  }
  return {
    id_richiesta: idNum,
    id_utente: Number(raw.id_utente ?? raw.IdUtente ?? raw.userId ?? 0),
    data_inizio: raw.dataInizio,
    data_fine: raw.dataFine,
    stato_approvazione: raw.StatoApprovazione ?? RequestStatus.PENDING,
    tipo_permesso: raw.tipo_permesso ?? raw.TipoPermesso,
  };
};
