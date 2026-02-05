// Servizio centralizzato per costruire e inviare le richieste al backend.
// Gestisce la normalizzazione dei campi e l'evita gli shift di timezone nella serializzazione.
import { http } from "../../../api/httpClient";
import { RequestStatus } from "../../../domain/entities/RequestStatus";
import { RequestType } from "../../../domain/entities/TypeRequest";
import { ExtraordinaryRequest } from "../../../domain/entities/RequestExtraordinary";
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";
import { PermitsRequest } from "../../../domain/entities/PermitsRequest";
import { SickRequest } from "../../../domain/entities/SickRequest";
import { mapHolidayResponse } from "../mappers/holidayMapper";

const REQUESTS_ENDPOINT = "/requests"; // Allinea con l'endpoint reale del backend
const HOLIDAY_ADD_ENDPOINT = "/RichiestaFerie/utente/addRichiestaFerie";
const HOLIDAY_LIST_ENDPOINT = "/RichiestaFerie/utente/getAllAssenzeById";
const HOLIDAY_DELETE_ENDPOINT = "/RichiestaFerie/utente/deleteRichiestaFerie";
const HOLIDAY_UPDATE_ENDPOINT = "/RichiestaFerie/utente/updateRichiestaFerie"; // verifica con backend

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

export type PostResultDTO = {
  Esito: string;
  CreatedCount: number;
  SkippedDates: string[]; // backend ritorna DateOnly come "YYYY-MM-DD"
  Motivazione?: string | null;
};

// Esito delle operazioni delete ferie (il backend risponde con esito/skippedDates/motivazione)
export type DeleteResultDTO = {
  Esito: string;
  Motivazione?: string | null;
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

const isPermitsRequest = (payload: RequestPayload): payload is PermitsRequest =>
  (payload as PermitsRequest).tipo_permesso !== undefined;

const isSickRequest = (payload: RequestPayload): payload is SickRequest =>
  (payload as SickRequest).certificato_medico !== undefined;

// Payload richiesto dal backend per aggiornare una richiesta esistente
export type UpdateHolidayInput = {
  IdRichiesta: number;
  DataInizio: string; // formato atteso: yyyy-MM-dd
  DataFine: string; // formato atteso: yyyy-MM-dd
  StatoApprovazione: string;
};

// Payload per eliminare una richiesta esistente (solo id)
export type DeleteHolidayInput = {
  //idRichiesta?: number;
  id_richiesta?: number;
  //IdRichiesta?: number;
};

// DTO minimale per inserire ferie quando l'utente è dedotto dal token (campi PascalCase richiesti dal backend)
type AddHolidayDto = {
  DataInizio: string;
  DataFine: string;
  StatoApprovazione: string;
};

// Pad helper
const pad2 = (n: number) => String(n).padStart(2, "0");

// Converte usando componenti UTC (coerenti con Date.UTC usato nell'applicazione orari)
// Output: yyyy-MM-ddTHH:mm:ss senza millisecondi e senza Z
const toLocalIsoString = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  const h = pad2(date.getUTCHours());
  const min = pad2(date.getUTCMinutes());
  const s = pad2(date.getUTCSeconds());
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
};

// Versione con spazio al posto di "T" per backend che fa DateTime.Parse su stringhe con spazio
const toLocalDateTimeStringWithSpace = (date: Date) => {
  return toLocalIsoString(date).replace("T", " "); // yyyy-MM-dd HH:mm:ss
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

  if (isPermitsRequest(payload)) {
    return {
      ...base,
      tipo_permesso: payload.tipo_permesso,
    };
  }
  if (isSickRequest(payload)) {
    return {
      ...base,
      certificato_medico: String(payload.certificato_medico),
    };
  }
  return base;
};

export const submitRequest = async (payload: RequestPayload) => {
  // Se si tratta di un permesso, inviamo un body con la shape richiesta
  if (isPermitsRequest(payload)) {
    const dto = {
      tipoPermesso: payload.tipo_permesso,
      dataInizio: toLocalIsoString(payload.data_inizio).slice(0, 10),
      dataFine: toLocalIsoString(payload.data_fine).slice(0, 10),
    };
    const { data } = await http.post<any>(REQUESTS_ENDPOINT, dto);
    return data;
  }

  // Serializza e invia al backend per gli altri tipi; ritorna la risposta tipizzata.
  const dto = mapPayloadToDto(payload);
  const { data } = await http.post<RequestDto>(REQUESTS_ENDPOINT, dto);
  return data;
};

// Invia una richiesta ferie usando l'utente dedotto dal token (endpoint dedicato)
export const submitHolidayByToken = async (
  startDate: Date,
  endDate: Date,
): Promise<PostResultDTO> => {
  const dto: AddHolidayDto = {
    DataInizio: toLocalDateTimeStringWithSpace(startDate),
    DataFine: toLocalDateTimeStringWithSpace(endDate),
    StatoApprovazione: RequestStatus.PENDING,
  };

  const { data } = await http.post<any>(HOLIDAY_ADD_ENDPOINT, dto);
  console.log("[requestsService] submitHolidayByToken response:", data);
  // mappa la response camelCase del server al nostro PostResultDTO
  return {
    Esito: String(data?.esito ?? ""),
    CreatedCount: Number(data?.createdCount ?? 0),
    SkippedDates: Array.isArray(data?.skippedDates) ? data.skippedDates : [],
    Motivazione: data?.motivazione ?? null,
  };
};

// Restituisce le assenze dell'utente (token) dal backend dedicato ferie/assenze
// Recupera le ferie dell'utente dal token; il backend richiede un parametro "data" (string)
export const fetchHolidaysByToken = async (
  dataFilter?: string,
): Promise<HolidayRequest[]> => {
  const today = new Date();
  const formatYmd = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
      .getDate()
      .toString()
      .padStart(2, "0")}`;

  const filter =
    dataFilter && dataFilter.trim() !== "" ? dataFilter : formatYmd(today);
  const query = `?data=${encodeURIComponent(filter)}`;
  const { data } = await http.get<any[]>(`${HOLIDAY_LIST_ENDPOINT}${query}`);
  return (data || []).map(mapHolidayResponse);
};

// Elimina una richiesta per id; aggiorna HOLIDAY_DELETE_ENDPOINT se il backend espone un path diverso
export const deleteHolidayById = async (
  id: number,
): Promise<DeleteResultDTO> => {
  const { data } = await http.delete<any>(
    `${HOLIDAY_DELETE_ENDPOINT}?id=${id}`,
  );

  if (__DEV__) {
    console.log("[requestsService] deleteHolidayById response:", data);
  }

  return {
    Esito: String(data?.esito ?? ""),
    Motivazione: data?.motivazione ?? null,
  };
};

// Aggiorna una richiesta esistente (ferie/assenza). Il body atteso è fornito dal backend.
export const updateHoliday = async (payload: UpdateHolidayInput) => {
  const { data } = await http.put(HOLIDAY_UPDATE_ENDPOINT, payload);
  console.log(payload);
  return data;
};
