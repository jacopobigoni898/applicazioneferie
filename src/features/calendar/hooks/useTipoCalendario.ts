import { useCallback, useState } from "react";
import {
  ModalitaCalendario,
  OPZIONI_VISTA_CALENDARIO,
} from "../../../domain/entities/TypeRequest";

// Hook per la gestione del tipo/modalità di calendario selezionato.
// Gestisce lo stato del dropdown e la selezione dell'opzione.
export function useTipoCalendario() {
  const [tipoCalendario, impostaTipoCalendario] = useState<string>(
    ModalitaCalendario.ASSENZA,
  );
  const [inFocus, impostaInFocus] = useState(false);

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
  };
}
