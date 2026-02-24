import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { ModalitaCalendario } from "../../../domain/entities/TypeRequest";
import {
  AddRichiestaPayload,
  aggiungiRichiesta,
} from "../../requests/services/requestsService";
import { estraiMessaggioErrore } from "../../../shared/utils/errorUtils";

// Hook per la gestione dell'invio delle richieste dal calendario.
// Gestisce la visibilità della modale e l'invio tramite API unificata.
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

  // Gestisce l'invio della richiesta tramite l'endpoint unificato
  const gestisciInvio = useCallback(
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
        Alert.alert("Errore", estraiMessaggioErrore(errore, "Errore durante l'invio"));
      }
    },
    [resettaIntervallo],
  );

  return {
    modaleVisibile,
    apriModale,
    chiudiModale,
    gestisciConferma,
    gestisciInvio,
  };
}
