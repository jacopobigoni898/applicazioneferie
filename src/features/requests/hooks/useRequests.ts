// Hook per il recupero e la gestione delle richieste (segnaposto)
// Qui andrà la logica per caricare, eliminare e aggiornare le richieste

export const useRichieste = (_tipo: string) => {
  // Da implementare
  return {
    elementiFormattati: [],
    inCaricamento: false,
    errore: null,
    ricarica: () => {},
    rimuovi: (_id: number) => {},
    aggiorna: async (_payload: any) => {},
  };
};
