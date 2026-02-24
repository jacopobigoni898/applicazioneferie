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
  ENDPOINT_ADMIN_TUTTE_RICHIESTE,
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

// Recupera tutte le richieste degli utenti (solo admin), passando la data odierna come parametro
export const recuperaTutteRichiesteAdmin = async (
  filtroData?: string,
): Promise<RichiestaFerie[]> => {
  const oggi = new Date();
  const filtro =
    filtroData && filtroData.trim() !== ""
      ? filtroData
      : formatoAnnoMeseGiorno(oggi);
  const query = `?data=${encodeURIComponent(filtro)}`;
  const { data } = await http.get<any[]>(
    `${ENDPOINT_ADMIN_TUTTE_RICHIESTE}${query}`,
  );
  return (data || []).map(mappaRispostaFerie);
};

// Invia una nuova richiesta con il payload unificato (multipart/form-data)
export const aggiungiRichiesta = async (
  payload: AddRichiestaPayload,
): Promise<RisultatoPostDTO> => {
  const formData = new FormData();
  formData.append("DataInizio", payload.dataInizio);
  formData.append("DataFine", payload.dataFine);
  formData.append("IdTipoRichiesta", String(payload.idTipoRichiesta));
  formData.append("Nota", payload.nota ?? "");
  if (payload.codiceRichiesta) {
    formData.append("codiceRichiesta", payload.codiceRichiesta);
  }
  if (payload.documento) {
    formData.append("Documento", payload.documento as any);
  }
  console.log(payload);

  const { data } = await http.post<any>(ENDPOINT_AGGIUNGI_RICHIESTA, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
  const formData = new FormData();
  formData.append("IdRichiesta", String(payload.IdRichiesta));
  formData.append("DataInizio", payload.DataInizio);
  formData.append("DataFine", payload.DataFine);
  formData.append("StatoApprovazione", payload.StatoApprovazione);
  if (payload.Documento) {
    formData.append("Documento", payload.Documento as any);
  }

  const { data } = await http.put<any>(ENDPOINT_AGGIORNA_RICHIESTA, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
