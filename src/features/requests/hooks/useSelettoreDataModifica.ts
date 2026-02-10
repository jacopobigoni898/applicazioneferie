// Hook per lo stato di apertura/chiusura dei due selettori data
// nella modale di modifica richiesta.
import { useCallback, useEffect, useState } from "react";

export function useSelettoreDataModifica(visibile: boolean) {
  const [mostraInizio, impostaMostraInizio] = useState(false);
  const [mostraFine, impostaMostraFine] = useState(false);

  // Resetta i selettori quando la modale appare/scompare
  useEffect(() => {
    if (visibile) {
      impostaMostraInizio(false);
      impostaMostraFine(false);
    }
  }, [visibile]);

  const apriInizio = useCallback(() => impostaMostraInizio(true), []);
  const chiudiInizio = useCallback(() => impostaMostraInizio(false), []);
  const apriFine = useCallback(() => impostaMostraFine(true), []);
  const chiudiFine = useCallback(() => impostaMostraFine(false), []);

  return {
    mostraInizio,
    mostraFine,
    apriInizio,
    chiudiInizio,
    apriFine,
    chiudiFine,
  } as const;
}
