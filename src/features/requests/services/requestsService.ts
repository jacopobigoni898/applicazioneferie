// Servizio per le chiamate API delle richieste (segnaposto)
// Qui andranno le funzioni per comunicare con il backend per le richieste

// Segnaposto: tipo per l'input di aggiornamento ferie
export type InputAggiornamentoFerie = {
  idRichiesta: number;
  dataInizio?: string;
  dataFine?: string;
  stato?: string;
};

// Segnaposto: recupera le richieste inviate
export const recuperaRichiesteInviate = async () => {
  // Da implementare
  return [];
};

// Segnaposto: recupera le richieste ricevute
export const recuperaRichiesteRicevute = async () => {
  // Da implementare
  return [];
};
