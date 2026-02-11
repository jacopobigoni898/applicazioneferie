import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { ModalitaCalendario } from "../../../domain/entities/TypeRequest";
import {
  PayloadRichiesta,
  AddRichiestaPayload,
  inviaFerieConToken,
  inviaRichiesta,
  aggiungiRichiestaPermessi,
  aggiungiRichiesta,
} from "../../requests/services/requestsService";

// Hook per la gestione dell'invio delle richieste dal calendario.
// Gestisce la visibilità della modale e il routing verso le API corrette
// in base al tipo di richiesta (ferie, permessi, generica).
export function useInvioRichiestaCalendario(
  tipoCalendario: string,
  resettaIntervallo: () => void,
) {
  const [modaleVisibile, impostaModaleVisibile] = useState(false);

  // Apre la modale di richiesta
  const apriModale = useCallback(() => {
    impostaModaleVisibile(true);
  }, []);

  // Chiudi la modale di richiesta
  const chiudiModale = useCallback(() => {
    impostaModaleVisibile(false);
  }, []);

  // Gestisce il pulsante "Procedi con la richiesta"
  const gestisciConferma = useCallback(
    (dataInizio: string | null, dataFine: string | null) => {
      if (!dataInizio || !dataFine) return;

      if (tipoCalendario === ModalitaCalendario.ADMIN) {
        Alert.alert("Admin", "Funzione admin non ancora implementata");
        return;
      }
      impostaModaleVisibile(true);
    },
    [tipoCalendario],
  );

  // Gestisce l'invio di una richiesta tramite il nuovo endpoint unificato
  const gestisciInvioNuovo = useCallback(
    async (payload: AddRichiestaPayload) => {
      try {
        const risultato = await aggiungiRichiesta(payload);
        const esitoOk = (risultato.Esito || "")
          .toLowerCase()
          .includes("riusc");
        if (!esitoOk) {
          Alert.alert(
            "Errore",
            risultato.Motivazione || risultato.Esito || "Invio non riuscito",
          );
          return;
        }

        impostaModaleVisibile(false);
        Alert.alert("Successo", "Richiesta inviata!");
        resettaIntervallo();
      } catch (errore: any) {
        const msg =
          errore?.response?.data?.message ||
          errore?.message ||
          "Errore durante l'invio";
        Alert.alert("Errore", msg);
      }
    },
    [resettaIntervallo],
  );

  // Gestisce l'invio finale della richiesta dalla modale (legacy).
  // Instrada verso l'API corretta in base al tipo di richiesta.
  const gestisciInvio = useCallback(
    async (dati: PayloadRichiesta) => {
      try {
        const eMalattia =
          (dati as any).certificato_medico !== undefined;
        const ePermesso = (dati as any).tipo_permesso !== undefined;
        const eFerie =
          tipoCalendario === ModalitaCalendario.ASSENZA &&
          !ePermesso &&
          !eMalattia;

        if (ePermesso) {
          const risultato = await aggiungiRichiestaPermessi(
            dati.data_inizio,
            dati.data_fine,
            (dati as any).tipo_permesso,
          );
          const esitoOk = (risultato.Esito || "")
            .toLowerCase()
            .includes("riusc");
          if (!esitoOk) {
            Alert.alert(
              "Errore",
              risultato.Motivazione || risultato.Esito || "Invio non riuscito",
            );
            return;
          }
        } else if (eFerie) {
          const risultato = await inviaFerieConToken(
            dati.data_inizio,
            dati.data_fine,
          );
          const esitoOk = (risultato.Esito || "")
            .toLowerCase()
            .includes("riusc");
          if (!esitoOk) {
            Alert.alert(
              "Errore",
              risultato.Motivazione || risultato.Esito || "Invio non riuscito",
            );
            return;
          }
        } else {
          // malattia, straordinari o altri tipi gestiti dall'endpoint generico
          await inviaRichiesta(dati);
        }

        impostaModaleVisibile(false);
        Alert.alert("Successo", "Richiesta inviata!");
        resettaIntervallo();
      } catch (errore: any) {
        const msg =
          errore?.response?.data?.message ||
          errore?.message ||
          "Errore durante l'invio";
        Alert.alert("Errore", msg);
      }
    },
    [tipoCalendario, resettaIntervallo],
  );

  return {
    modaleVisibile,
    apriModale,
    chiudiModale,
    gestisciConferma,
    gestisciInvio,
    gestisciInvioNuovo,
  };
}
