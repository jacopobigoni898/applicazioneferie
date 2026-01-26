// Servizio centralizzato per costruire e inviare le richieste al backend.
// Gestisce la normalizzazione dei campi e l'evita gli shift di timezone nella serializzazione.
import { http } from "../../../api/httpClient";
import { RequestStatus } from "../../../domain/entities/RequestStatus";
import { RequestType } from "../../../domain/entities/TypeRequest";
import { ExtraordinaryRequest } from "../../../domain/entities/RequestExtraordinary";
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";
import { PermitsRequest } from "../../../domain/entities/PermitsRequest";
import { SickRequest } from "../../../domain/entities/SickRequest";

const REQUESTS_ENDPOINT = "/requests"; // Allinea con l'endpoint reale del backend

// Union dei payload gestiti: straordinari, ferie, permessi e malattia.
export type RequestPayload =
  | ExtraordinaryRequest
  | HolidayRequest
  | PermitsRequest
  | SickRequest;

// Parametri esterni per costruire un payload coerente con i tipi dominio.
export type BuildRequestParams = {
  mainType: "assenza" | "straordinari";
  subType: string;
  startDate: Date;
  endDate: Date;
  userId: number;
  status?: RequestStatus;
};

// Forma base del DTO che inviamo: le date sono stringhe locali, non ISO con "Z".
type BaseDto = {
  id_richiesta: number;
  id_utente: number;
  data_inizio: string;
  data_fine: string;
  stato_approvazione: RequestStatus;
};

// Variante DTO a seconda del tipo: permesso (tipo_permesso) o malattia (certificato_medico).
type RequestDto =
  | (BaseDto & { tipo_permesso?: string })
  | (BaseDto & { certificato_medico?: string });

// Converte in ISO locale senza "Z" per evitare shift di timezone lato backend
const toLocalIsoString = (date: Date) => {
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tzOffsetMs);
  return local.toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss
};

export const buildRequestPayload = ({
  mainType,
  subType,
  startDate,
  endDate,
  userId,
  status = RequestStatus.PENDING,
}: BuildRequestParams): RequestPayload => {
  // Branch principale: se straordinari, mappa direttamente al tipo dedicato.
  if (mainType === "straordinari") {
    const extraRequest: ExtraordinaryRequest = {
      id_richiesta: 0,
      id_utente: userId,
      data_inizio: startDate,
      data_fine: endDate,
      stato_approvazione: status,
    };
    return extraRequest;
  }

  const typeLower = subType.toLowerCase();

  // Ferie: match su parola chiave "ferie".
  if (typeLower.includes(RequestType.FERIE)) {
    const holidayRequest: HolidayRequest = {
      id_richiesta: 0,
      id_utente: userId,
      data_inizio: startDate,
      data_fine: endDate,
      stato_approvazione: status,
    };
    return holidayRequest;
  }

  if (typeLower.includes(RequestType.MALATTIA)) {
    const sickRequest: SickRequest = {
      id_richiesta: 0,
      id_utente: userId,
      data_inizio: startDate,
      data_fine: endDate,
      stato_approvazione: status,
      certificato_medico: "",
    };
    return sickRequest;
  }

  const permitsRequest: PermitsRequest = {
    id_richiesta: 0,
    id_utente: userId,
    tipo_permesso: subType,
    data_inizio: startDate,
    data_fine: endDate,
    stato_approvazione: status,
  };
  return permitsRequest;
};

const mapPayloadToDto = (payload: RequestPayload): RequestDto => {
  // Converte gli oggetti dominio (con Date) in DTO serializzabili per la POST.
  const base: BaseDto = {
    id_richiesta: payload.id_richiesta,
    id_utente: payload.id_utente,
    data_inizio: toLocalIsoString(payload.data_inizio),
    data_fine: toLocalIsoString(payload.data_fine),
    stato_approvazione: payload.stato_approvazione,
  };

  if ((payload as PermitsRequest).tipo_permesso !== undefined) {
    return { ...base, tipo_permesso: (payload as PermitsRequest).tipo_permesso };
  }
  if ((payload as SickRequest).certificato_medico !== undefined) {
    return {
      ...base,
      certificato_medico: String((payload as SickRequest).certificato_medico),
    };
  }
  return base;
};

export const submitRequest = async (payload: RequestPayload) => {
  // Serializza e invia al backend; ritorna la risposta tipizzata.
  const dto = mapPayloadToDto(payload);
  const { data } = await http.post<RequestDto>(REQUESTS_ENDPOINT, dto);
  return data;
};
