// Hook per il recupero e la gestione delle richieste (inviate / ricevute).
// Carica i dati dal backend, supporta eliminazione con rollback ottimistico
// e aggiornamento con rollback in caso di errore.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  eliminaFeriePerId,
  aggiornaRichiesta,
  recuperaFerieConToken,
  recuperaTutteRichieste,
  InputAggiornamentoFerie,
} from "../services/requestsService";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { formattaStringaData } from "../utils/formattaData";

// Estensione con date formattate per la visualizzazione
export type RichiestaFormattata = RichiestaFerie & {
  inizioFormattato: string;
  fineFormattata: string;
};

export type TipoScheda = "inviate" | "ricevute";

// Estrae il messaggio di errore da un errore generico
const estraiMessaggio = (err: unknown, fallback: string): string => {
  if (typeof err === "object" && err !== null) {
    const e = err as any;
    return e?.response?.data?.message || e?.message || fallback;
  }
  return fallback;
};

export function useRichieste(tipo: TipoScheda = "inviate") {
  const [elementi, impostaElementi] = useState<RichiestaFerie[]>([]);
  const elementiRef = useRef<RichiestaFerie[]>(elementi);
  elementiRef.current = elementi;
  const [inCaricamento, impostaInCaricamento] = useState(false);
  const [errore, impostaErrore] = useState<string | null>(null);

  // Carica le richieste dal backend
  const caricaDati = useCallback(async () => {
    impostaInCaricamento(true);
    impostaErrore(null);
    try {
      // Usa il nuovo endpoint unificato; fallback al vecchio se fallisce
      let dati: RichiestaFerie[];
      try {
        dati = await recuperaTutteRichieste();
      } catch {
        dati = await recuperaFerieConToken();
      }
      impostaElementi(dati);
    } catch (err: unknown) {
      impostaErrore(estraiMessaggio(err, "Errore di caricamento"));
    } finally {
      impostaInCaricamento(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  // Carica al montaggio e al cambio di tipo
  useEffect(() => {
    caricaDati();
  }, [caricaDati]);

  // Elementi con date formattate per la visualizzazione
  const elementiFormattati: RichiestaFormattata[] = useMemo(() => {
    return elementi.map((el) => ({
      ...el,
      inizioFormattato: formattaStringaData(el.data_inizio as any),
      fineFormattata: formattaStringaData(el.data_fine as any),
    }));
  }, [elementi]);

  // Elimina una richiesta con aggiornamento ottimistico e rollback
  const rimuovi = useCallback(async (id: number) => {
    impostaErrore(null);
    let precedenti: RichiestaFerie[] = [];

    const tipoPerEliminazione = elementiRef.current.find(
      (el) => el.id_richiesta === id,
    )?.tipo_permesso;

    impostaElementi((correnti) => {
      precedenti = correnti;
      return correnti.filter((el) => el.id_richiesta !== id);
    });

    try {
      await eliminaFeriePerId(id, tipoPerEliminazione);
    } catch (err: unknown) {
      impostaErrore(estraiMessaggio(err, "Errore eliminazione"));
      impostaElementi(precedenti); // rollback
    }
  }, []);

  // Aggiorna una richiesta con aggiornamento ottimistico e rollback
  const aggiorna = useCallback(async (payload: InputAggiornamentoFerie) => {
    impostaErrore(null);
    let precedenti: RichiestaFerie[] = [];

    const tipoPerAggiornamento = elementiRef.current.find(
      (el) => el.id_richiesta === payload.IdRichiesta,
    )?.tipo_permesso;

    impostaElementi((correnti) => {
      precedenti = correnti;
      return correnti.map((el) => {
        if (el.id_richiesta === payload.IdRichiesta) {
          return {
            ...el,
            data_inizio: new Date(payload.DataInizio),
            data_fine: new Date(payload.DataFine),
            stato_approvazione: payload.StatoApprovazione as any,
          };
        }
        return el;
      });
    });

    try {
      await aggiornaRichiesta(payload, tipoPerAggiornamento);
    } catch (err: unknown) {
      impostaErrore(estraiMessaggio(err, "Errore aggiornamento"));
      impostaElementi(precedenti); // rollback
      throw err; // ri-lanciato per la modale
    }
  }, []);

  return {
    elementi,
    elementiFormattati,
    inCaricamento,
    errore,
    ricarica: caricaDati,
    rimuovi,
    aggiorna,
  } as const;
}
