// Servizio API per gli endpoint unificati delle richieste.
import { http } from "../../../api/httpClient";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { mappaRispostaFerie } from "../mappers/holidayMapper";
import { formatoAnnoMeseGiorno } from "./serializzazioneDate";
import { File as FSFile, Paths } from "expo-file-system";
import {
  TipoRichiestaDTO,
  AddRichiestaPayload,
  RisultatoPostDTO,
  RisultatoDeleteDTO,
  InputAggiornamentoRichiesta,
  ENDPOINT_TUTTE_RICHIESTE,
  ENDPOINT_AGGIUNGI_RICHIESTA,
  ENDPOINT_AGGIORNA_RICHIESTA,
  ENDPOINT_ELIMINA_RICHIESTA,
  ENDPOINT_TUTTI_TIPO_RICHIESTA,
  ENDPOINT_GETDOCUMENTI,
} from "./tipiRichieste";

// Recupera tutte le tipologie di richiesta dal backend
export const recuperaTipiRichiesta = async (): Promise<TipoRichiestaDTO[]> => {
  const { data } = await http.get<TipoRichiestaDTO[]>(
    ENDPOINT_TUTTI_TIPO_RICHIESTA,
  );
  return data || [];
};

// Recupera tutte le richieste dell'utente, passando la data odierna come parametro
export const recuperaTutteRichieste = async (
  filtroData?: string,
): Promise<RichiestaFerie[]> => {
  const oggi = new Date();
  const filtro =
    filtroData && filtroData.trim() !== ""
      ? filtroData
      : formatoAnnoMeseGiorno(oggi);
  const query = `?data=${encodeURIComponent(filtro)}`;
  const { data } = await http.get<any[]>(`${ENDPOINT_TUTTE_RICHIESTE}${query}`);
  return (data || []).map(mappaRispostaFerie);
};

// Costruisce un FormData a partire da un dizionario chiave-valore.
// I valori null/undefined vengono ignorati; i non-stringa convertiti con String().
const buildFormData = (campi: Record<string, unknown>): FormData => {
  const fd = new FormData();
  for (const [chiave, valore] of Object.entries(campi)) {
    if (valore === null || valore === undefined) continue;
    if (typeof valore === "object" && "uri" in (valore as any)) {
      fd.append(chiave, valore as any);
    } else {
      fd.append(chiave, typeof valore === "string" ? valore : String(valore));
    }
  }
  return fd;
};

const FORM_DATA_HEADERS = { headers: { "Content-Type": "multipart/form-data" } };

// Invia una nuova richiesta con il payload unificato (multipart/form-data)
export const aggiungiRichiesta = async (
  payload: AddRichiestaPayload,
): Promise<RisultatoPostDTO> => {
  const formData = buildFormData({
    DataInizio: payload.dataInizio,
    DataFine: payload.dataFine,
    IdTipoRichiesta: payload.idTipoRichiesta,
    Nota: payload.nota ?? "",
    codiceRichiesta: payload.codiceRichiesta,
    Documento: payload.documento,
  });

  const { data } = await http.post<any>(ENDPOINT_AGGIUNGI_RICHIESTA, formData, FORM_DATA_HEADERS);
  return {
    Esito: String(data?.esito ?? data?.Esito ?? ""),
    CreatedCount: Number(data?.createdCount ?? data?.CreatedCount ?? 0),
    SkippedDates: Array.isArray(data?.skippedDates)
      ? data.skippedDates
      : Array.isArray(data?.SkippedDates)
        ? data.SkippedDates
        : [],
    Motivazione: data?.motivazione ?? data?.Motivazione ?? null,
  };
};

// Elimina una richiesta per ID
export const eliminaRichiesta = async (
  id: number,
): Promise<RisultatoDeleteDTO> => {
  const { data } = await http.delete<any>(
    `${ENDPOINT_ELIMINA_RICHIESTA}?id=${id}`,
  );
  return {
    Esito: String(data?.esito ?? data?.Esito ?? ""),
    Motivazione: data?.motivazione ?? data?.Motivazione ?? null,
  };
};

// Aggiorna una richiesta esistente
export const aggiornaRichiesta = async (
  payload: InputAggiornamentoRichiesta,
) => {
  const formData = buildFormData({
    IdRichiesta: payload.IdRichiesta,
    DataInizio: payload.DataInizio,
    DataFine: payload.DataFine,
    StatoApprovazione: payload.StatoApprovazione,
    Documento: payload.Documento,
  });

  const { data } = await http.put<any>(ENDPOINT_AGGIORNA_RICHIESTA, formData, FORM_DATA_HEADERS);
  return data;
};

// Recupera il documento allegato a una richiesta (per ID richiesta).
// Usa il client http (axios) per sfruttare l'interceptor di autenticazione.
export const recuperaDocumento = async (
  idRichiesta: number,
): Promise<{ uri: string; name: string; type: string } | null> => {
  try {
    const risposta = await http.get(ENDPOINT_GETDOCUMENTI, {
      params: { id: idRichiesta },
      responseType: "arraybuffer",
    });

    const contentDisposition =
      risposta.headers["content-disposition"] ?? "";
    const match = /filename=([^;]+)/.exec(contentDisposition);
    const nomeFile = match
      ? match[1].trim().replace(/^["']|["']$/g, "")
      : `documento_${idRichiesta}.pdf`;

    const file = new FSFile(Paths.cache, nomeFile);
    file.create({ overwrite: true });
    file.write(new Uint8Array(risposta.data));

    return {
      uri: file.uri,
      name: nomeFile,
      type: risposta.headers["content-type"] ?? "application/pdf",
    };
  } catch (e: any) {
    // Log solo errori imprevisti (rete, filesystem), non errori server attesi (es. 500 = nessun documento)
    if (!e?.response?.status) {
      console.warn("Errore nel recupero del documento:", e);
    }
    return null;
  }
};
