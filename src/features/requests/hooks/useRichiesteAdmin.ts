// Hook per il recupero delle richieste ricevute (solo admin).
// Carica tutte le richieste dal backend, esclude quelle dell'admin corrente,
// e supporta l'aggiornamento dello stato (autorizza/rifiuta).
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import {
  recuperaTutteRichiesteAdmin,
  aggiornaRichiesta,
  InputAggiornamentoRichiesta,
} from "../services/requestsService";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { formattaStringaData } from "../utils/formattaData";
import { aStringaIsoLocale } from "../services/serializzazioneDate";
import { useFocusEffect } from "@react-navigation/native";
import { RichiestaFormattata } from "./useRichieste";

const estraiMessaggio = (err: unknown, fallback: string): string => {
  if (typeof err === "object" && err !== null) {
    const e = err as any;
    return e?.response?.data?.message || e?.message || fallback;
  }
  return fallback;
};

export function useRichiesteAdmin(idUtenteAdmin: string) {
  const [elementi, impostaElementi] = useState<RichiestaFerie[]>([]);
  const [inCaricamento, impostaInCaricamento] = useState(false);
  const [errore, impostaErrore] = useState<string | null>(null);

  const caricaDati = useCallback(async () => {
    impostaInCaricamento(true);
    impostaErrore(null);
    try {
      const dati = await recuperaTutteRichiesteAdmin();
      impostaElementi(dati);
    } catch (err: unknown) {
      impostaErrore(estraiMessaggio(err, "Errore di caricamento"));
    } finally {
      impostaInCaricamento(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      caricaDati();
    }, [caricaDati]),
  );

  // Filtra le richieste dell'admin corrente
  const elementiAltriUtenti = useMemo(
    () => elementi.filter((el) => String(el.id_utente) !== idUtenteAdmin),
    [elementi, idUtenteAdmin],
  );

  const elementiFormattati: RichiestaFormattata[] = useMemo(() => {
    return elementiAltriUtenti.map((el) => ({
      ...el,
      inizioFormattato: formattaStringaData(el.data_inizio as any),
      fineFormattata: formattaStringaData(el.data_fine as any),
    }));
  }, [elementiAltriUtenti]);

  // Aggiorna lo stato di una richiesta (autorizza o rifiuta)
  const aggiornaStato = useCallback(
    async (idRichiesta: number, nuovoStato: StatoRichiesta) => {
      const richiesta = elementi.find((el) => el.id_richiesta === idRichiesta);
      if (!richiesta) return;

      const etichettaStato =
        nuovoStato === StatoRichiesta.AUTORIZZATO ? "autorizzare" : "rifiutare";

      Alert.alert(
        "Conferma",
        `Sei sicuro di voler ${etichettaStato} questa richiesta?`,
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Conferma",
            onPress: async () => {
              impostaErrore(null);
              let precedenti: RichiestaFerie[] = [];

              impostaElementi((correnti) => {
                precedenti = correnti;
                return correnti.map((el) =>
                  el.id_richiesta === idRichiesta
                    ? { ...el, stato_approvazione: nuovoStato }
                    : el,
                );
              });

              try {
                const payload: InputAggiornamentoRichiesta = {
                  IdRichiesta: idRichiesta,
                  DataInizio: aStringaIsoLocale(richiesta.data_inizio),
                  DataFine: aStringaIsoLocale(richiesta.data_fine),
                  StatoApprovazione: nuovoStato,
                };
                await aggiornaRichiesta(payload);
              } catch (err: unknown) {
                impostaErrore(
                  estraiMessaggio(err, "Errore aggiornamento stato"),
                );
                impostaElementi(precedenti);
              }
            },
          },
        ],
      );
    },
    [elementi],
  );

  return {
    elementiFormattati,
    inCaricamento,
    errore,
    ricarica: caricaDati,
    aggiornaStato,
  } as const;
}
