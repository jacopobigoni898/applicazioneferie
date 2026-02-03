import { SickRequest } from "../../../domain/entities/SickRequest";
import { RequestStatus } from "../../../domain/entities/RequestStatus";

const parseDate = (value: any): Date => {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

export const mapSickResponse = (raw: any): SickRequest => {
  const idNum = Number(
    raw?.idRichiesta ?? raw?.id_richiesta ?? raw?.IdRichiesta ?? 0,
  );
  return {
    id_richiesta: idNum,
    id_utente: Number(raw?.id_utente ?? raw?.IdUtente ?? raw?.userId ?? 0),
    data_inizio: parseDate(
      raw?.dataInizio ?? raw?.data_inizio ?? raw?.DataInizio,
    ),
    data_fine: parseDate(raw?.dataFine ?? raw?.data_fine ?? raw?.DataFine),
    stato_approvazione:
      raw?.StatoApprovazione ??
      raw?.stato_approvazione ??
      RequestStatus.PENDING,
    certificato_medico: String(
      raw?.certificato_medico ?? raw?.CertificatoMedico ?? "",
    ),
  };
};
