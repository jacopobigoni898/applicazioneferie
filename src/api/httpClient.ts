import axios from "axios";
import { URL_BASE_API } from "../config/env";
import { storageAuth } from "../core/auth/authStorage";

// Istanza Axios condivisa per tutte le chiamate API
export const http = axios.create({
  baseURL: URL_BASE_API,
  timeout: 15000,
});

// Handler esterno per notificare l'app in caso di 401 (es. logout forzato)
let suNonAutorizzato: (() => void) | null = null;
export const impostaHandlerNonAutorizzato = (handler: () => void) => {
  suNonAutorizzato = handler;
};

// Interceptor richiesta: inserisce il bearer letto da SecureStore (via storageAuth)
http.interceptors.request.use(async (config) => {
  const token = await storageAuth.recuperaTokenAccesso();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor risposta: se arriva 401 il token è presumibilmente invalido → puliamo storage e notifichiamo
http.interceptors.response.use(
  (risposta) => risposta,
  async (errore) => {
    const stato = errore?.response?.status;
    if (stato === 401) {
      await storageAuth.cancellaSessione();
      if (suNonAutorizzato) {
        suNonAutorizzato();
      }
    }
    return Promise.reject(errore);
  },
);
