// Client HTTP condiviso per le chiamate API (segnaposto)
// Qui andrà la configurazione di Axios con interceptor per autenticazione

// Segnaposto: istanza HTTP
export const http = {};

// Segnaposto: handler per risposta non autorizzata (401)
export const impostaHandlerNonAutorizzato = (_handler: () => void) => {};
