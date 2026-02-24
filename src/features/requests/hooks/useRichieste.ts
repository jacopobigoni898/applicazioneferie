// Hook per il recupero e la gestione delle richieste (inviate / ricevute).
// Carica i dati dal backend, supporta eliminazione con rollback ottimistico
// e aggiornamento con rollback in caso di errore.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import {
  eliminaRichiesta,
  aggiornaRichiesta,
  recuperaTutteRichieste,
  InputAggiornamentoRichiesta,
} from "../services/requestsService";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { formattaStringaData } from "../utils/formattaData";
import { useFocusEffect } from "@react-navigation/native";
import { estraiMessaggioErrore } from "../../../shared/utils/errorUtils";

// Estensione con date formattate per la visualizzazione
export type RichiestaFormattata = RichiestaFerie & {
  inizioFormattato: string;
  fineFormattata: string;
};

export type TipoScheda = "inviate" | "ricevute";

export function useRichieste(tipo: TipoScheda = "inviate") {
  const [elementi, impostaElementi] = useState<RichiestaFerie[]>([]);
  const [inCaricamento, impostaInCaricamento] = useState(false);
  const [errore, impostaErrore] = useState<string | null>(null);

  // Carica le richieste dal backend
  const caricaDati = useCallback(async () => {
    impostaInCaricamento(true);
    impostaErrore(null);
    try {
      const dati = await recuperaTutteRichieste();
      impostaElementi(dati);
    } catch (err: unknown) {
      impostaErrore(estraiMessaggioErrore(err, "Errore di caricamento"));
    } finally {
      impostaInCaricamento(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  // Carica al montaggio e al cambio di tipo

  useFocusEffect(
    useCallback(() => {
      caricaDati();
    }, [caricaDati]),
  );

  // Elementi con date formattate per la visualizzazione
  const elementiFormattati: RichiestaFormattata[] = useMemo(() => {
    return elementi.map((el) => ({
      ...el,
      inizioFormattato: formattaStringaData(el.data_inizio as any),
      fineFormattata: formattaStringaData(el.data_fine as any),
    }));
  }, [elementi]);

  // Elimina una richiesta con conferma, aggiornamento ottimistico e rollback
  const rimuovi = useCallback((id: number) => {
    Alert.alert(
      "Conferma eliminazione",
      "Sei sicuro di voler eliminare questa richiesta?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            impostaErrore(null);
            let precedenti: RichiestaFerie[] = [];

            impostaElementi((correnti) => {
              precedenti = correnti;
              return correnti.filter((el) => el.id_richiesta !== id);
            });

            try {
              await eliminaRichiesta(id);
            } catch (err: unknown) {
              impostaErrore(estraiMessaggioErrore(err, "Errore eliminazione"));
              impostaElementi(precedenti); // rollback
            }
          },
        },
      ],
    );
  }, []);

  // Aggiorna una richiesta con aggiornamento ottimistico e rollback
  const aggiorna = useCallback(async (payload: InputAggiornamentoRichiesta) => {
    impostaErrore(null);
    let precedenti: RichiestaFerie[] = [];

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
      await aggiornaRichiesta(payload);
    } catch (err: unknown) {
      impostaErrore(estraiMessaggioErrore(err, "Errore aggiornamento"));
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
