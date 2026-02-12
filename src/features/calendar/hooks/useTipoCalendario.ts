import { useCallback, useEffect, useState } from "react";
import {
  ModalitaCalendario,
  OPZIONI_VISTA_CALENDARIO,
} from "../../../domain/entities/TypeRequest";
import {
  TipoRichiestaDTO,
  recuperaTipiRichiesta,
} from "../../requests/services/requestsService";

// Hook per la gestione del tipo/modalità di calendario selezionato.
// Gestisce lo stato del dropdown, la selezione dell'opzione e
// il caricamento dei tipi di richiesta dal backend.
export function useTipoCalendario() {
  const [tipoCalendario, impostaTipoCalendario] = useState<string>(
    ModalitaCalendario.ASSENZA,
  );
  const [inFocus, impostaInFocus] = useState(false);

  // Tipi di richiesta caricati dal backend
  const [tipiRichiesta, impostaTipiRichiesta] = useState<TipoRichiestaDTO[]>(
    [],
  );

  // Carica i tipi di richiesta all'inizializzazione
  useEffect(() => {
    const carica = async () => {
      try {
        const dati = await recuperaTipiRichiesta();
        impostaTipiRichiesta(dati);
      } catch (err) {
        console.warn("Errore caricamento tipi richiesta:", err);
      }
    };
    carica();
  }, []);

  // Opzione attualmente selezionata (per mostrare l'etichetta nel dropdown)
  const opzioneSelezionata = OPZIONI_VISTA_CALENDARIO.find(
    (opzione) => opzione.value === tipoCalendario,
  );

  // Gestisce la selezione di una nuova opzione
  const gestisciSelezioneOpzione = useCallback((valore: string) => {
    impostaTipoCalendario(valore);
    impostaInFocus(false);
  }, []);

  return {
    tipoCalendario,
    inFocus,
    impostaInFocus,
    opzioneSelezionata,
    gestisciSelezioneOpzione,
    opzioniVista: OPZIONI_VISTA_CALENDARIO,
    testoSegnaposto: "Scegli il tipo di calendario",
    tipiRichiesta,
  };
}
