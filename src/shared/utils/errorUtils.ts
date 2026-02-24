// Utilità centralizzata per l'estrazione di messaggi di errore.
// Condivisa da useRichieste, useModificaRichiesta, useInvioRichiestaCalendario.

/** Estrae un messaggio leggibile da un errore generico (Axios o Error). */
export const estraiMessaggioErrore = (
  err: unknown,
  fallback: string,
): string => {
  if (typeof err === "object" && err !== null) {
    const e = err as any;
    return e?.response?.data?.message || e?.message || fallback;
  }
  return fallback;
};
